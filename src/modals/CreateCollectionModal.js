import React from 'react';
import { Button, Modal, Form } from 'semantic-ui-react';

import { CreateCollectionButton } from '../rmrk-function-calls/CollectionButtons';

// --- Create Collection Modal ---
const CreateCollectionModal = (props) => {
  const { accountPair, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});

  const formChange = (key) => (ev, el) => {
    setFormValue({ ...formValue, [key]: el.value });
  };

  const handleClick = () => {
    console.log('click create collection modal');
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button basic color="green">
          Create Collection
        </Button>
      }
    >
      <Modal.Header>Create Collection</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            fluid
            label="Metadata"
            placeholder="Metadata"
            onChange={formChange('metadata')}
          />
          <Form.Input
            fluid
            label="Max"
            placeholder="Max"
            onChange={formChange('max')}
          />
          <Form.Input
            fluid
            label="Symbol"
            placeholder="Symbol"
            onChange={formChange('symbol')}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="grey" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <CreateCollectionButton
          newCollectionValues={formValue}
          accountPair={accountPair}
          setStatus={setStatus}
          onClick={handleClick}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default CreateCollectionModal;
