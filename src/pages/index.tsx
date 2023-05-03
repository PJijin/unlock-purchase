import networks from '@unlock-protocol/networks';
import { Paywall } from '@unlock-protocol/paywall';
import { WalletService } from '@unlock-protocol/unlock-js';
import { useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

const paywallConfig = {
	locks: {
		'0xb7b6d5233b5015f3587f83fbc041aafd60d48339': {
			network: 5,
		},
	},
	skipRecipient: true,
	title: 'My Membership',
};

function Page() {
	const { isConnected, connector } = useAccount();
	const [loading, setLoading] = useState(false);

	const purchase = async () => {
		setLoading(true);
		const lock = '0x4b00cf4507bbc7fb21e7e8d822881bebdf4b4dac';
		const walletAddress = ['0xf1996154C34e3dc77b26437a102231785e9aD7fE'];
		const signatureData = [
			'0xc36326b71ab227aaf1f6be512a2c9ce6b5c6df7f672ae12dea235226102bece771a0de94ec723c22eef06fa0943d66a45e31e9f6514da7f94aababa4e157311e1c',
		];
		const signature = true;
		const signer = await connector?.getSigner();

		const provider = signer.provider;

		const walletService = new WalletService({
			80001: {
				unlockAddress: '0x1FF7e338d5E582138C46044dc238543Ce555C963',
				provider: 'https://rpc.unlock-protocol.com/80001',
				chainId: '0x13881',
				network: 'maticmum',
				explorer: 'https://mumbai.polygonscan.com',
				password_hook: '0x34EbEc0AE80A2d078DE5489f0f5cAa4d3aaEA355',
			},
		});
		await walletService.connect(provider, signer);

		const purchase = await walletService.purchaseKeys(
			{
				lockAddress: lock,
				owners: walletAddress,
				data: signature ? signatureData : null,
			},
			{
				gasLimit: 1000000,
			}, // transaction options
			(error, hash) => {
				console.log({ hash });
			}
		);

		setLoading(false);
	};

	const { connect } = useConnect({
		connector: new InjectedConnector(),
	});

	const checkout = async () => {
		const provider = await connector!.getProvider();
		const paywall = new Paywall(paywallConfig, networks, provider);
		paywall.loadCheckoutModal(paywallConfig, 'https://staging-app.unlock-protocol.com');
		return false;
	};

	return (
		<>
			<h1>wagmi + Next.js </h1>
			{!isConnected && <button onClick={() => connect()}>Connect</button>}
			{isConnected && (
				<>
					<button onClick={() => purchase()}>Purchase</button>
				</>
			)}
		</>
	);
}

export default Page;
