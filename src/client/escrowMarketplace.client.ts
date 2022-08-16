import * as anchor from '@project-serum/anchor';
import { BN, Idl, Program, AnchorProvider } from '@project-serum/anchor';
import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { SolanaPointSystem } from './data/solana_point_system';
import { AccountUtils, toBN, isKp, toByteArray } from './common';
import axios from "axios";

// const metaplexUrl = "http://localhost:5000";
const metaplexUrl = "https://turbo-octo-enigma.herokuapp.com"
export class EscrowMarketplaceClient extends AccountUtils {
    // @ts-ignore
    wallet: anchor.Wallet;
    provider!: anchor.Provider;
    escrowMarketplaceProgram!: anchor.Program<SolanaPointSystem>;

    constructor(
        conn: Connection,
        // @ts-ignore
        wallet: anchor.Wallet,
        idl?: Idl,
        programId?: PublicKey
    ) {
        super(conn);
        this.wallet = wallet;
        this.setProvider();
        this.setEscrowMarketplaceProgram(idl, programId);
    }

    setProvider() {
        this.provider = new AnchorProvider(this.conn, this.wallet, AnchorProvider.defaultOptions());
        anchor.setProvider(this.provider);
    }

    setEscrowMarketplaceProgram(idl?: Idl, programId?: PublicKey) {
        //instantiating program depends on the environment
        if (idl && programId) {
            //means running in prod
            this.escrowMarketplaceProgram = new anchor.Program<SolanaPointSystem>(
                idl as any,
                programId,
                this.provider
            );
        }
    }

    // --------------------------------------- fetch deserialized accounts

    async fetchAllListingProofAcc() {
        const items = await this.escrowMarketplaceProgram.account.baseAccount.all();
        return items
    }

    async fetchListingProofAccBySeller(seller: PublicKey) {
        const items = await this.escrowMarketplaceProgram.account.baseAccount.all();
        let filteredBySeller = items.filter(function (item) {
            return item.account.sellerKey.equals(seller);
          });
        
        return filteredBySeller;
    }

    async fetchListingProofAccByTokenAccount(tokenAccount: PublicKey) {
        const items = await this.escrowMarketplaceProgram.account.baseAccount.all();
        
        let filteredByToken = items.filter(function (item) {
            // console.log(item.account.sellerKey.equals(tokenAccount));
            return item.account.sellerToken.equals(tokenAccount);
          });
    
        return filteredByToken;
    }

    async fetchListingProofAccByEscrowToken(escrowToken: PublicKey) {

        return (await this.escrowMarketplaceProgram.account.baseAccount.all());
    }

        async createListing(seller: PublicKey, sellerToken: PublicKey, nftMint: PublicKey) {


        const [listingProofPda, listingProofAccountBump] =    await PublicKey.findProgramAddress(
            [seller.toBytes(), nftMint.toBytes(), Buffer.from(anchor.utils.bytes.utf8.encode("points"))],
            // need programid since the program is the one that is "init" this account! and it uses its own programid to derive/find the suitable address!
            this.escrowMarketplaceProgram.programId
          );


        const txSig = await this.escrowMarketplaceProgram.methods
            .create("10")
            .accounts({
                sellerToken: sellerToken,
                baseAccount: listingProofPda,
                seller: seller,
                mintAddress: nftMint,
            })
            .rpc();

        return { txSig, listingProofPda };
    }

    async fetchNFTData(mintAddress: String){
        var config = {
            method: 'get',
            url: metaplexUrl + `/getNFTbyMint?mint=${mintAddress}`,
            headers: { }
          };
          
          const result = await axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
            return response.data
          })
          .catch(function (error) {
            console.log(error);
          });

          return result;
          
    }

    async evolveNFTImage(mintAddress: String, imageUrl: String){
        
        var config = {
            method: 'get',
            url: metaplexUrl + `/updateNFTMetadata?mint=${mintAddress}&attributes=5,17,3&imageurl=${imageUrl}`,
            headers: { }
        };
        
        const result: String = await axios(config)
        .then(function (response) {
            return "Success";
        })
        .catch(function (error) {
            // console.log(error);
            return "Failed"
        });

        return result

    }

    // async cancelListing(seller: PublicKey, escrowToken: PublicKey, nftMint: PublicKey) {
        async increment(seller: PublicKey, escrowToken: PublicKey, nftMint: PublicKey) {

            const results = await this.fetchListingProofAccByTokenAccount(escrowToken);
            
            const [listingProofPda, listingProofAccountBump] =    await PublicKey.findProgramAddress(
                [seller.toBytes(), nftMint.toBytes(), Buffer.from(anchor.utils.bytes.utf8.encode("points"))],
                // need programid since the program is the one that is "init" this account! and it uses its own programid to derive/find the suitable address!
                this.escrowMarketplaceProgram.programId
              );
              const txSig = await this.escrowMarketplaceProgram.methods
            .increment()
            .accounts({
                baseAccount: listingProofPda,
                owner: seller,
            })
            .rpc();

            function delay(ms: number) {
                return new Promise( resolve => setTimeout(resolve, ms) );
            }
            await delay(20000);


            const results1 = await this.fetchListingProofAccByTokenAccount(escrowToken);

            if (results1[0].account.count.toNumber() > results[0].account.count.toNumber()){
                console.log(results[0].account.count.toNumber(), " became ", results1[0].account.count.toNumber());
                const mintAddress = results[0].account.mintAddress.toBase58();
                const currentNFT = await this.fetchNFTData(mintAddress);
                let evolvedImageUrl = "";
                if (currentNFT.json.image == "https://bafkreiep6um5ivn33iskqlot33e4fu2qe77xnbujalsbi7nmj6xm5u3y3a.ipfs.nftstorage.link/"){
                    evolvedImageUrl = "https://bafybeieur7uhekznn5c7vp55esp236x2rb4mqaum4l7qbhngfvwybhqcxq.ipfs.nftstorage.link/1.png";
                }else{
                    evolvedImageUrl = "https://bafkreiep6um5ivn33iskqlot33e4fu2qe77xnbujalsbi7nmj6xm5u3y3a.ipfs.nftstorage.link/";
                }
                await this.evolveNFTImage(mintAddress, evolvedImageUrl);
            }
        
        return ;
    }

}
