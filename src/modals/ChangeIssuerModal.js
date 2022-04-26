import React from 'react';
import { Button, Modal, Form } from 'semantic-ui-react';

import { ChangeIssuerButton } from '../rmrk-function-calls/CollectionButtons';

// --- Change Issuer Modal ---
const ChangeIssuer = (props) => {
  const { collectionId, accountPair, setStatus } = props;
  const [open, setOpen] = React.useState(false);
  const [formValue, setFormValue] = React.useState({});

  const formChange = (key) => (ev, el) => {
    setFormValue({ ...formValue, [key]: el.value });
  };

  const confirmAndClose = () => {
    setOpen(false);
    // setStatus;
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button basic color="yellow">
          Change Issuer
        </Button>
      }
    >
      <Modal.Header>Change Issuer</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            fluid
            label="New Issuer"
            placeholder="New Issuer"
            onChange={formChange('newIssuerAddress')}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="grey" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <ChangeIssuerButton
          collectionId={collectionId}
          newIssuerAddress={formValue.newIssuerAddress}
          accountPair={accountPair}
          setStatus={setStatus}
          onClick={confirmAndClose}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ChangeIssuer;
