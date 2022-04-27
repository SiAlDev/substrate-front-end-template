import { Card, Label } from 'semantic-ui-react';
import { DestroyCollectionButton } from './rmrk-function-calls/CollectionButtons';
import ChangeIssuerModal from './modals/ChangeIssuerModal';

// --- About Collection Card ---
const CollectionCard = (props) => {
  const { collection, accountPair, setStatus } = props;
  const {
    collectionId = collectionId,
    issuer = issuer,
    metadata = metadata,
    max = max,
    symbol = symbol,
    nftsCount = nftsCount,
  } = collection;
  const displayCollectionTitle = JSON.stringify(symbol);
  const isSelf = accountPair.address === collection.issuer;

  return (
    <Card>
      {isSelf && (
        <Label as="a" floating color="teal">
          Mine
        </Label>
      )}
      {/* <CollectionAvatar dna={dna.toU8a()} /> */}
      <Card.Content>
        <Card.Meta style={{ fontSize: '.9em', overflowWrap: 'break-word' }}>
          Symbol: {displayCollectionTitle}
        </Card.Meta>
        <Card.Description>
          <p style={{ overflowWrap: 'break-word' }}>Issuer: {issuer}</p>
          <p style={{ overflowWrap: 'break-word' }}>
            Collection Id: {collectionId}
          </p>
          <p style={{ overflowWrap: 'break-word' }}>Metadata: {metadata}</p>
          <p style={{ overflowWrap: 'break-word' }}>Max: {max}</p>
          <p style={{ overflowWrap: 'break-word' }}>
            NFTs count: {nftsCount || 'No NFT'}
          </p>
        </Card.Description>
      </Card.Content>
      <Card.Content extra style={{ textAlign: 'center' }}>
        {issuer === accountPair.address ? (
          <>
            <DestroyCollectionButton
              collection={collection}
              accountPair={accountPair}
              setStatus={setStatus}
            />
            <ChangeIssuerModal
              collectionId={collectionId}
              accountPair={accountPair}
              setStatus={setStatus}
            />
            {/* <SetPrice collection={collection} accountPair={accountPair} setStatus={setStatus} /> */}
            {/* <TransferModal collection={collection} accountPair={accountPair} setStatus={setStatus} /> */}
          </>
        ) : (
          <>
            {/* <BuyCollection collection={collection} accountPair={accountPair} setStatus={setStatus} /> */}
          </>
        )}
      </Card.Content>
    </Card>
  );
};

export default CollectionCard;
