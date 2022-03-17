import React from 'react';
import { Button, Card, Grid, Message, Modal, Form, Label } from 'semantic-ui-react';
import Collections from './Rmrk';

// import CollectionAvatar from './CollectionAvatar';
import { TxButton } from './substrate-lib/components';


const DestroyCollectionButton = props => {
  const { collection, accountPair, setStatus } = props;

  return <TxButton
  accountPair={accountPair}
  label='Destroy Collection'
  type='SIGNED-TX'
  setStatus={setStatus}
  attrs={{
    palletRpc: 'rmrkCore',
    callable: 'destroyCollection',
    inputParams: [collection.collectionId],
    paramFields: [true]
  }}
  />;
};

// --- About Collection Card ---
const CollectionCard = props => {
  const { collection, accountPair, setStatus } = props;
  const { collectionId = collectionId,
          issuer = issuer, 
          metadata = metadata, 
          max = max, 
          symbol = symbol,
          nftsCount = nftsCount } = collection;
  const displayCollectionTitle = JSON.stringify(symbol);
  const isSelf = accountPair.address === collection.issuer;

  return <Card>
    {isSelf && <Label as='a' floating color='teal'>Mine</Label>}
    {/* <CollectionAvatar dna={dna.toU8a()} /> */}
    <Card.Content>
      <Card.Meta style={{ fontSize: '.9em', overflowWrap: 'break-word' }}>
        Symbol: {displayCollectionTitle}
      </Card.Meta>
      <Card.Description>
        <p style={{ overflowWrap: 'break-word' }}>
          Issuer: {issuer}
        </p>
        <p style={{ overflowWrap: 'break-word' }}>
          Collection Id: {collectionId}
        </p>
        <p style={{ overflowWrap: 'break-word' }}>
          Metadata: {metadata}
        </p>
        <p style={{ overflowWrap: 'break-word' }}>
          Max: {max}
        </p>
        <p style={{ overflowWrap: 'break-word' }}>
          NFTs count: {nftsCount || 'No NFT'}
        </p>
      </Card.Description>
    </Card.Content>
    <Card.Content extra style={{ textAlign: 'center' }}>{issuer === accountPair.address
      ? <>
      <DestroyCollectionButton collection={collection} accountPair={accountPair} setStatus={setStatus} />
        {/* <SetPrice collection={collection} accountPair={accountPair} setStatus={setStatus} /> */}
        {/* <TransferModal collection={collection} accountPair={accountPair} setStatus={setStatus} /> */}
      </>
      : <>
        {/* <BuyCollection collection={collection} accountPair={accountPair} setStatus={setStatus} /> */}
      </>
    }</Card.Content>
  </Card>;
};

const CollectionCards = props => {
  const { collections, accountPair, setStatus } = props;

  console.log('collectionCards=' + JSON.stringify(collections));
  if (collections == null || collections.length === 0) {
    return <Message info>
      <Message.Header>No Collection found here... Create one now!&nbsp;
        <span role='img' aria-label='point-down'>👇</span>
      </Message.Header>
    </Message>;
  }

  return <Grid columns={3}>{collections.map((collection, i) =>
    <Grid.Column key={`collection-${i}`}>
      <CollectionCard collection={collection} accountPair={accountPair} setStatus={setStatus} />
    </Grid.Column>
  )}</Grid>;
};

export default CollectionCards;