export type SolanaPointSystem = {
  "version": "0.1.0",
  "name": "solana_point_system",
  "instructions": [
    {
      "name": "create",
      "accounts": [
        {
          "name": "sellerToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "seller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "evolutionLevel",
          "type": "string"
        }
      ]
    },
    {
      "name": "increment",
      "accounts": [
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "baseAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sellerToken",
            "type": "publicKey"
          },
          {
            "name": "mintAddress",
            "type": "publicKey"
          },
          {
            "name": "sellerKey",
            "type": "publicKey"
          },
          {
            "name": "tier",
            "type": "u64"
          },
          {
            "name": "count",
            "type": "u64"
          },
          {
            "name": "evolutionLevel",
            "type": "string"
          }
        ]
      }
    }
  ]
};

export const IDL: SolanaPointSystem = {
  "version": "0.1.0",
  "name": "solana_point_system",
  "instructions": [
    {
      "name": "create",
      "accounts": [
        {
          "name": "sellerToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "seller",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "evolutionLevel",
          "type": "string"
        }
      ]
    },
    {
      "name": "increment",
      "accounts": [
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "baseAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sellerToken",
            "type": "publicKey"
          },
          {
            "name": "mintAddress",
            "type": "publicKey"
          },
          {
            "name": "sellerKey",
            "type": "publicKey"
          },
          {
            "name": "tier",
            "type": "u64"
          },
          {
            "name": "count",
            "type": "u64"
          },
          {
            "name": "evolutionLevel",
            "type": "string"
          }
        ]
      }
    }
  ]
};
