## Applicable for DropERC721 contract by thirdweb

When claiming a large amount of ERC721 tokens to multiple recipients,
we could potentially batch the list of recipients like this:

### If the claim order matters:

```csv
address,quantity
address-a,1
address-a,3
address-b,3,
address-a,1
```

can be optimized as:
```csv
address,quantity
address-a,4
address-b,3,
address-a,1
```
- results in 3 separate claimTo being batched

### If the claim order is irrelevant
```csv
address,quantity
address-a,1
address-a,3
address-b,3,
address-a,1
```

can be optimized as:
```csv
address,quantity
address-a,5
address-b,3
```
- results in only 2 claimTo being batched, which means more efficient + higher chance of success