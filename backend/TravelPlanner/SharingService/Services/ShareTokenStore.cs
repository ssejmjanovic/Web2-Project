using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Data;
using Microsoft.ServiceFabric.Data.Collections;
using SharingService.Models;

namespace SharingService.Services
{

    public interface IShareTokenStore
    {
        Task SaveAsync(ShareToken token);
        Task<ShareToken> FindAsync(string token);
        Task<List<ShareToken>> GetForPlanAsync(int travelPlanId);
    }
    public class ShareTokenStore : IShareTokenStore
    {

        private const string DictionaryName = "shareTokens";
        private readonly IReliableStateManager _stateManager;

        public ShareTokenStore(IReliableStateManager stateManager)
        {
            _stateManager = stateManager;
        }

        public async Task SaveAsync(ShareToken token)
        {
            var tokens = await _stateManager
                .GetOrAddAsync<IReliableDictionary<string, ShareToken>>(DictionaryName);

            using (var tx = _stateManager.CreateTransaction())
            {
                await tokens.SetAsync(tx, token.Token, token);
                await tx.CommitAsync();
            }
        }

        public async Task<ShareToken> FindAsync(string token)
        {
            var tokens = await _stateManager
                .GetOrAddAsync<IReliableDictionary<string, ShareToken>>(DictionaryName);

            using (var tx = _stateManager.CreateTransaction())
            {
                var result = await tokens.TryGetValueAsync(tx, token);
                return result.HasValue ? result.Value : null;
            }
        }

        public async Task<List<ShareToken>> GetForPlanAsync(int travelPlanId)
        {
            var tokens = await _stateManager
                .GetOrAddAsync<IReliableDictionary<string, ShareToken>>(DictionaryName);

            var matches = new List<ShareToken>();

            using (var tx = _stateManager.CreateTransaction())
            {
                var enumerable = await tokens.CreateEnumerableAsync(tx);
                var enumerator = enumerable.GetAsyncEnumerator();

                while(await enumerator.MoveNextAsync(CancellationToken.None))
                {
                    if (enumerator.Current.Value.TravelPlanId == travelPlanId)
                        matches.Add(enumerator.Current.Value);
                }
            }
            return matches;
        }
    }
}
