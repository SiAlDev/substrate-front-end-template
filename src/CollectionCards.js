import React from 'react';
import { Button, Card, Grid, Message, Modal, Form, Label } from 'semantic-ui-react';
import Collections from './Rmrk';

// import CollectionAvatar from './CollectionAvatar';
import { TxButton } from './substrate-lib/components';

// --- Transfer Modal ---

const TransferModal = props => {
  const { collection, accountPair, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});

  const formChange = key => (ev, el) => {
    setFormValue({ ...formValue, [key]: el.value });
  };

  const confirmAndClose = (unsub) => {
    setOpen(false);
    if (unsub && typeof unsub === 'function') unsub();
  };

  return <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}
    trigger={<Button basic color='blue'>Transfer</Button>}>
    <Modal.Header>Collection Transfer</Modal.Header>
    <Modal.Content><Form>
      <Form.Input fluid label='Collection ID' readOnly value={colletion.symbol} />
      <Form.Input fluid label='Receiver' placeholder='Receiver Address' onChange={formChange('target')} />
    </Form></Modal.Content>
    <Modal.Actions>
      <Button basic color='grey' onClick={() => setOpen(false)}>Cancel</Button>
      <TxButton
        accountPair={accountPair}
        label='Transfer'
        type='SIGNED-TX'
        setStatus={setStatus}
        onClick={confirmAndClose}
        attrs={{
          palletRpc: 'substrateKitties',
          callable: 'transfer',
          inputParams: [formValue.target, colletion.symbol],
          paramFields: [true, true]
        }}
      />
    </Modal.Actions>
  </Modal>;
};

// --- Set Price ---

const SetPrice = props => {
  const { collection, accountPair, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});

  const formChange = key => (ev, el) => {
    setFormValue({ ...formValue, [key]: el.value });
  };

  const confirmAndClose = (unsub) => {
    setOpen(false);
    if (unsub && typeof unsub === 'function') unsub();
  };

  return <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}
    trigger={<Button basic color='blue'>Set Price</Button>}>
    <Modal.Header>Set Collection Price</Modal.Header>
    <Modal.Content><Form>
      <Form.Input fluid label='Collection ID' readOnly value={colletion.symbol} />
      <Form.Input fluid label='Price' placeholder='Enter Price' onChange={formChange('target')} />
    </Form></Modal.Content>
    <Modal.Actions>
      <Button basic color='grey' onClick={() => setOpen(false)}>Cancel</Button>
      <TxButton
        accountPair={accountPair}
        label='Set Price'
        type='SIGNED-TX'
        setStatus={setStatus}
        onClick={confirmAndClose}
        attrs={{
          palletRpc: 'substrateKitties',
          callable: 'setPrice',
          inputParams: [colletion.symbol, formValue.target],
          paramFields: [true, true]
        }}
      />
    </Modal.Actions>
  </Modal>;
};

// --- Buy Collection ---

const BuyCollection = props => {
  const { collection, accountPair, setStatus } = props;
  const [open, setOpen] = React.useState(false);

  const confirmAndClose = (unsub) => {
    setOpen(false);
    if (unsub && typeof unsub === 'function') unsub();
  };

  if (!collection.price) {
    return <></>;
  }

  return <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}
    trigger={<Button basic color='green'>Buy Collection</Button>}>
    <Modal.Header>Buy Collection</Modal.Header>
    <Modal.Content><Form>
      <Form.Input fluid label='Collection ID' readOnly value={colletion.symbol} />
      <Form.Input fluid label='Price' readOnly value={collection.price} />
    </Form></Modal.Content>
    <Modal.Actions>
      <Button basic color='grey' onClick={() => setOpen(false)}>Cancel</Button>
      <TxButton
        accountPair={accountPair}
        label='Buy Collection'
        type='SIGNED-TX'
        setStatus={setStatus}
        onClick={confirmAndClose}
        attrs={{
          palletRpc: 'substrateKitties',
          callable: 'buyCollection',
          inputParams: [colletion.symbol, collection.price],
          paramFields: [true, true]
        }}
      />
    </Modal.Actions>
  </Modal>;
};

// --- About Collection Card ---

const CollectionCard = props => {
  const { collection, accountPair, setStatus } = props;
  const { dna = null, owner = null, gender = null, price = null } = collection;
  const displayDna = "dna && dna.toJSON()";
  const isSelf = accountPair.address === colletion.issuer;

  return <Card>
    {isSelf && <Label as='a' floating color='teal'>Mine</Label>}
    {/* <CollectionAvatar dna={dna.toU8a()} /> */}
    <Card.Content>
      <Card.Meta style={{ fontSize: '.9em', overflowWrap: 'break-word' }}>
        DNA: {displayDna}
      </Card.Meta>
      <Card.Description>
        <p style={{ overflowWrap: 'break-word' }}>
          {/* Gender: {gender} */}
        </p>
        <p style={{ overflowWrap: 'break-word' }}>
          {/* Owner: {owner} */}
        </p>
        <p style={{ overflowWrap: 'break-word' }}>
          {/* Price: {price || 'Not For Sale'} */}
        </p>
      </Card.Description>
    </Card.Content>
    {/* <Card.Content extra style={{ textAlign: 'center' }}>{owner === accountPair.address
      ? <>
        <SetPrice collection={collection} accountPair={accountPair} setStatus={setStatus} />
        <TransferModal collection={collection} accountPair={accountPair} setStatus={setStatus} />
      </>
      : <>
        <BuyCollection collection={collection} accountPair={accountPair} setStatus={setStatus} />
      </>
    }</Card.Content> */}
  </Card>;
};

const CollectionCards = props => {
  const { colletions, accountPair, setStatus } = props;

  console.log('collectionCards=' + JSON.stringify(colletions));
  if (colletions == null || colletions.length === 0) {
    return <Message info>
      <Message.Header>No Collection found here... Create one now!&nbsp;
        <span role='img' aria-label='point-down'>👇</span>
      </Message.Header>
    </Message>;
  }

  return <Grid columns={3}>{colletions.map((collection, i) =>
    <Grid.Column key={`collection-${i}`}>
      <CollectionCard collection={collection} accountPair={accountPair} setStatus={setStatus} />
    </Grid.Column>
  )}</Grid>;
};

export default CollectionCards;