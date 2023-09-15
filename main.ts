import { ApiPromise, Keyring } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';

async function subscribeTemplateUpdates() {
  const wsProvider = new WsProvider('ws://127.0.0.1:9944');
  const api = await ApiPromise.create({ provider: wsProvider });

  const keyring = new Keyring({ type: 'sr25519' });

  // 订阅账户地址
  const account = keyring.addFromUri('//Alice', { name: 'Alice' });
  const accountId = account.address;

  // 订阅 Template 模块中的值更新
  api.query.templateModule.something((result: string) => {
    console.log(`Value updated: ${result.toString()}`);
  });

  // 订阅 Template 模块中的 SomethingStored 事件
  api.query.system.events((events: any) => {
    events.forEach((record: any) => {
      const { event, phase } = record;

      if (event.section === 'templateModule' && event.method === 'SomethingStored') {
        const [newValue] = event.data;
        console.log(`SomethingStored event received with new value: ${newValue}`);
      }
    });
  });

  console.log(`Subscribed to Template updates and events for account: ${accountId}`);
}

subscribeTemplateUpdates().catch(console.error);