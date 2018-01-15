import React from 'react';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class DropdownButton extends React.Component {

    state = {
        dropdownOpen: false
    };

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    };

    render() {
        return (
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <Button cardtype={this.props.cardtype} color={this.props.color} onClick={this.props.onClick}>{this.props.name}</Button>
                <DropdownToggle caret color={this.props.color} />
                <DropdownMenu>
                    {this.props.children}
                </DropdownMenu>
            </ButtonDropdown>
        );
    }
}