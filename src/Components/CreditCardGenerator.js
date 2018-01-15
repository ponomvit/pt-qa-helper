import React from 'react';
import generator from '../utils/gencc'
import DropdownButton from './DropdownButton'
import CreditCardIcon from 'react-icons/lib/go/credit-card'
import Toast from './Toast'
import copy from 'copy-to-clipboard';
import { Container, DropdownItem, InputGroup,InputGroupAddon, Input } from 'reactstrap';

class CreditCardGenerator extends React.Component {
    state = {
        creditCardNumber: '4111111111111111',
        isAlertVisible: false,
        alertMessage: null,
        alertColor: null
    };

    removeToast = (t=2000) => {
        setTimeout(() => this.setState({
            isAlertVisible:false
        }),t)
    };

    generateCreditCardNumber = event => {
        let number = generator.GenCC(event.target.getAttribute('cardtype'));
        copy(number);
        this.setState({
            creditCardNumber: number,
            isAlertVisible: true,
            alertMessage: `${event.target.getAttribute('cardtype')} card number is successfully copied`,
            alertColor: 'success'
        });
        this.removeToast();
    };

    render() {
        return (
            <Container>
                <h5>Generate credit card</h5>
                <InputGroup>
                    <InputGroupAddon><CreditCardIcon/></InputGroupAddon>
                    <Input disabled placeholder='4111 1111 1111 1111' value={this.state.creditCardNumber.toString().replace(/(.{4})/g,"$1 ")}/>
                    <DropdownButton color='info' cardtype="VISA" onClick={this.generateCreditCardNumber} name="VISA">
                        <DropdownItem cardtype="Mastercard" onClick={this.generateCreditCardNumber}>MasterCard</DropdownItem>
                        <DropdownItem cardtype="Amex" onClick={this.generateCreditCardNumber}>Amex</DropdownItem>
                        <DropdownItem cardtype="Diners" onClick={this.generateCreditCardNumber}>Diners</DropdownItem>
                        <DropdownItem cardtype="Discover" onClick={this.generateCreditCardNumber}>Discover</DropdownItem>
                        <DropdownItem cardtype="EnRoute" onClick={this.generateCreditCardNumber}>EnRoute</DropdownItem>
                        <DropdownItem cardtype="JCB" onClick={this.generateCreditCardNumber}>JCB</DropdownItem>
                        <DropdownItem cardtype="Voyager" onClick={this.generateCreditCardNumber}>Voyager</DropdownItem>
                    </DropdownButton>
                </InputGroup>
                <Toast visible={this.state.isAlertVisible} color={this.state.alertColor}>{this.state.alertMessage}</Toast>
            </Container>
        );
    }
}

export default CreditCardGenerator;