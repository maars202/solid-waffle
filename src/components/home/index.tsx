import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import React, { useEffect, useRef, useState } from 'react';
import { createFakeWallet, initEscrowMarketplaceClient } from '../../client/common';
import { getMintsMetadata } from '../../utils';
import CardNFT, { NFTInterface } from '../common/cardNFT';
import CreateListing from '../manageNFTs/createListing';

const Home = () => {
    const wallet = useAnchorWallet();
    console.log("wallet: ", wallet?.publicKey.toString())
    const [walletPubKey, setWalletPubKey] = useState<PublicKey>();
    const [allListedCardsNftInfo, setAllListedCardsNftInfo] = useState<NFTInterface[]>();



    const setAllListedStates = async (wallet: AnchorWallet | undefined) => {
        if (wallet == undefined){
            return [];
        }
        const emClient = await initEscrowMarketplaceClient();
        // const allListingProofAccounts = await emClient.fetchAllListingProofAcc();
        const allListingProofAccounts = await emClient.fetchListingProofAccBySeller(wallet.publicKey);
        console.log("for wallet: ", wallet.publicKey.toString(), "displayed on marketplace: ", allListingProofAccounts)
        setAllListedCardsNftInfo(
            allListingProofAccounts.map((tokenAccountInfo) => {
                return {
                    sellerKey: tokenAccountInfo.account.sellerKey,
                    mintPubKey: tokenAccountInfo.account.mintAddress,
                    tokenPubKey: tokenAccountInfo.account.sellerToken,
                    imageUrl: 'loading',
                    name: 'loading',
                    // price: 0,
                };
            })
        );

        const availMintsMetadata = await getMintsMetadata(
            // allListingProofAccounts.map((tokenAccountInfo) => tokenAccountInfo.account.nftMint)
            allListingProofAccounts.map((tokenAccountInfo) => tokenAccountInfo.account.mintAddress)
        );

        setAllListedCardsNftInfo(
            allListingProofAccounts.map((tokenAccountInfo, index) => {
                
                return {
                    sellerKey: tokenAccountInfo.account.sellerKey,
                    mintPubKey: tokenAccountInfo.account.mintAddress,
                    tokenPubKey: tokenAccountInfo.account.sellerToken,
                    imageUrl: availMintsMetadata[index].imageUrl,
                    name: availMintsMetadata[index].name,
                    // price: tokenAccountInfo.account.listPrice.toNumber(),
                };
            })
        );
    };

    useEffect(() => {
        (async () => {
            const fakeWallet = createFakeWallet();
            // await setAllListedStates(fakeWallet);
            console.log("setting correct wallet: ", wallet?.publicKey.toString());
            let m = wallet?.publicKey;
            await setAllListedStates(wallet);
        })();
    }, []);

    return (
        <div className="grid grid-cols-12 gap-6">
            {/* <CreateListing /> */}
            {allListedCardsNftInfo?.map((cardInfoNFT, index) => (
                <CardNFT
                    nft={cardInfoNFT}
                    wallet={wallet}
                    setStates={setAllListedStates}
                    isListed={true}
                    key={index}
                />
            ))}
        </div>
    );
};

export default Home;
