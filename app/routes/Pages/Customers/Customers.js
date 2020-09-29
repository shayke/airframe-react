import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import faker from 'faker/locale/en_US';
import moment from 'moment';

import {
    Container, Row, Col,
    ButtonGroup, Button, Label, Input,
    Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, FormFeedback, FormText
} from './../../../components';

import { HeaderMain } from "../../components/HeaderMain";
import { SearchBar } from "./SearchBar";

const sortCaret = (order) => {
    if (!order)
        return <i className="fa fa-fw fa-sort text-muted"></i>;
    if (order)
        return <i className={`fa fa-fw text-muted fa-sort-${order}`}></i>
}

const columns = [
    {
        dataField: 'name',
        text: 'Name',
        style: { cursor: 'pointer' },
        sort: true,
        sortCaret
    },
    {
        dataField: 'contact',
        text: 'Contact',
        style: { cursor: 'pointer' },
        sort: true,
        sortCaret
    },
    {
        dataField: 'phone',
        text: 'Phone',
        style: { cursor: 'pointer' },
        sort: true,
        sortCaret
    },
    {
        dataField: 'dateAdded',
        text: 'Date Added',
        style: { cursor: 'pointer' },
        formatter: (cell) => moment(cell).format('DD/MM/YYYY'),
        sort: true,
        sortCaret
    }
];

const fakeData = _.times(10, (index) => ({
    id: index,
    name: faker.company.companyName(),
    contact: faker.commerce.productName(),
    phone: faker.phone.phoneNumberFormat(),
    dateAdded: faker.date.past()
}));

const EMPTY_CUSTOMER = { name: '', contact: '', phone: '' }

const AddNewModal = (props) => {
    const { isOpen, existingCustomer, toggle } = props;

    const [customer, setCustomer] = useState(EMPTY_CUSTOMER);

    useEffect(() => {
        if (existingCustomer) {
            setCustomer(existingCustomer);
        }
      }, [existingCustomer]);

    const onInputChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const isValid = () => {
        return customer.name && customer.contact && customer.phone;
    }

    const cancel = () => {
        setCustomer(EMPTY_CUSTOMER);
        toggle(null);
    }

    const save = () => {
        setCustomer(EMPTY_CUSTOMER);
        toggle(customer);
    }

    return (
        <Modal isOpen={isOpen} toggle={ cancel }>
            <ModalHeader tag="h5">{ existingCustomer ? 'Edit Customer' : 'Create Customer' }</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="name">Customer Name</Label>
                        <Input name="name" id="name" value={ customer.name } onChange={onInputChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="contact">Contact Name</Label>
                        <Input name="contact" id="contact" value={ customer.contact } onChange={onInputChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="phone">Phone</Label>
                        <Input name="phone" id="phone" value={ customer.phone } onChange={onInputChange} />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color='link' className="text-primary" onClick={ cancel }>Close</Button>
                <Button color='primary' onClick={ save } disabled={ !isValid() } >Save</Button>
            </ModalFooter>
        </Modal>
    );
}

const CustomersPage = () => {
    const [customers, setCustomers] = useState(fakeData);
    const [modal, setModal] = useState(false);
    const [editCustomer, setEditCustomer] = useState(null);

    const onNewModalClosed = (newCustomer) => {
        if (newCustomer) {
            if (editCustomer) {
                let oldCustomerIndex = customers.findIndex((c) => c.id === editCustomer.id);
                const newCustomers = [...customers];
                newCustomers[oldCustomerIndex] = {
                    ...newCustomers[oldCustomerIndex],
                    ...newCustomer
                }
                setCustomers(newCustomers);
            } else {
                newCustomer.id = customers.length + 1;
                newCustomer.dateAdded = new Date();
                setCustomers([newCustomer, ...customers]);
            }
        }

        setModal(!modal);
        setEditCustomer(null);
    };

    const onRowSelected = (customerRow) => {
        setEditCustomer(customerRow);
        setModal(true);
    }

    return (
        <Container>
            <HeaderMain title="Customers" className="mb-5 mt-4" />
            <Row>
                <AddNewModal isOpen={modal} existingCustomer={editCustomer}  toggle={ onNewModalClosed } />
                <Col>
                    <ToolkitProvider
                        keyField="id"
                        data={ customers }
                        columns={ columns }
                        search
                    >
                    {
                        props => (
                            <React.Fragment>
                                <div className="d-flex justify-content-end align-items-center mb-2">
                                    <div className="d-flex ml-auto">
                                        <SearchBar className="mr-2" { ...props.searchProps } />
                                        <ButtonGroup>
                                            <Button
                                                color="primary"
                                                className="align-self-center"
                                                size="sm"
                                                onClick={ () => setModal(true) }
                                            >
                                                <i className="fa fa-fw fa-plus"></i>
                                            </Button>
                                        </ButtonGroup>
                                    </div>
                                </div>
                                <BootstrapTable
                                    classes="table-responsive-lg"
                                    bordered={ false }
                                    responsive
                                    striped
                                    insertRow={true}
                                    selectRow={ { mode: 'checkbox', hideSelectColumn: true, clickToSelect: true, onSelect: onRowSelected } }
                                    hover
                                    { ...props.baseProps }
                                />
                            </React.Fragment>
                        )
                    }
                    </ToolkitProvider>
                </Col>
            </Row>
        </Container>
    );
}

export default CustomersPage;