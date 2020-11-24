import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Container, Form, FormGroup, Input, Label } from "reactstrap";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import AppNavbar from "./AppNavbar";

class GroupEdit extends Component {
  emptyItem = {
    name: "",
    address: "",
    city: "",
    stateOrProvince: "",
    country: "",
    postalCode: "",
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      countries: [],
      states: [],
      cities: [],
      selectedCountry: "--Choose Country--",
      selectedState: "--Choose State--",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeCountry = this.changeCountry.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  toggle(event) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  changeValue(e) {
    this.setState({ dropDownValue: e.currentTarget.textContent });
    let id = e.currentTarget.getAttribute("id");
    console.log(id);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== "new") {
      const group = await (
        await fetch(`/api/group/${this.props.match.params.id}`)
      ).json();
      this.setState({ item: group });
    }
    this.setState({
      countries: [
        {
          name: "USA",
          states: [
            {
              name: "Florida",
              cities: ["Duesseldorf", "Leinfelden-Echterdingen", "Eschborn"],
            },
            { name: "Nevada" },
          ],
        },
        {
          name: "Canada",
          states: [
            {
              name: "Ontario",
              cities: ["Delhi", "Kolkata", "Mumbai", "Bangalore"],
            },
            { name: "Alberta" },
          ],
        },
      ],
    });
  }

  changeCountry(event) {
    this.setState({ selectedCountry: event.target.value });
    this.setState({
      states: this.state.countries.find(
        (cntry) => cntry.name === event.target.value
      ).states,
    });
    this.handleChange(event);
  }

  changeState(event) {
    this.setState({ selectedState: event.target.value });
    const stats = this.state.countries.find(
      (cntry) => cntry.name === this.state.selectedCountry
    ).states;
    this.setState({
      cities: stats.find((stat) => stat.name === event.target.value).cities,
    });
    this.handleChange(event);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = { ...this.state.item };
    item[name] = value;
    this.setState({ item });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { item } = this.state;

    await fetch("/api/group" + (item.id ? "/" + item.id : ""), {
      method: item.id ? "PUT" : "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    this.props.history.push("/groups");
  }

  render() {
    const { item } = this.state;
    const title = <h2>{item.id ? "Edit Group" : "Add Group"}</h2>;

    return (
      <div>
        <AppNavbar />
        <Container>
          {title}
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={item.name || ""}
                onChange={this.handleChange}
                autoComplete="name"
              />
            </FormGroup>
            <FormGroup>
              <Label for="address">Address</Label>
              <Input
                type="text"
                name="address"
                id="address"
                value={item.address || ""}
                onChange={this.handleChange}
                autoComplete="address-level1"
              />
            </FormGroup>
            <FormGroup>
              <Label for="city">City</Label>
              <Input
                type="text"
                name="city"
                id="city"
                value={item.city || ""}
                onChange={this.handleChange}
                autoComplete="address-level1"
              />
            </FormGroup>
            <div className="row">
              <FormGroup className="col-md-5 mb-3">
                <Label for="country">Country</Label>
                <Input
                  type="select"
                  name="country"
                  id="country"
                  placeholder="Country"
                  onChange={this.changeCountry}
                >
                  <option>{item.country || this.state.selectedCountry}</option>
                  {this.state.countries.map((e, key) => {
                    return <option key={key}>{e.name}</option>;
                  })}
                </Input>
              </FormGroup>
              <FormGroup className="col-md-4 mb-3">
                <Label for="stateOrProvince">State/Province</Label>
                <Input
                  type="select"
                  placeholder="State"
                  name="stateOrProvince"
                  value={this.state.selectedState}
                  onChange={this.changeState}
                >
                  <option>
                    {item.stateOrProvince || this.state.selectedState}
                  </option>
                  {this.state.states.map((e, key) => {
                    return <option key={key}>{e.name}</option>;
                  })}
                </Input>
              </FormGroup>
              {/* <FormGroup className="col-md-5 mb-3">
              <Label for="country">Country</Label>
              <Input type="text" name="country" id="country" value={item.country || ''}
                     onChange={this.handleChange} autoComplete="address-level1"/>
            </FormGroup> */}

              <FormGroup className="col-md-3 mb-3">
                <Label for="country">Postal Code</Label>
                <Input
                  type="text"
                  name="postalCode"
                  id="postalCode"
                  value={item.postalCode || ""}
                  onChange={this.handleChange}
                  autoComplete="address-level1"
                />
              </FormGroup>
            </div>
            <FormGroup>
              <Button color="primary" type="submit">
                Save
              </Button>{" "}
              <Button color="secondary" tag={Link} to="/groups">
                Cancel
              </Button>
            </FormGroup>
          </Form>
        </Container>
      </div>
    );
  }
}

export default withRouter(GroupEdit);
