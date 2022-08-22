import React, { Component } from 'react';
import '../../config';
import {
  Button, TextField, LinearProgress, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
const axios = require('axios');

function myMatch(origin,search){
  for(let i = 0;i < origin.length;i++){
      let flag = true;
    for(let j = 0;j < search.length;j++){
      if(i+j >= origin.length||origin[i+j] !== search[j]){
          flag = false;
      }
    }
    if(flag){
        return true;
    }
  }
  return false;
}

export default class Shop extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openProductModal: false,
      openProductEditModal: false,
      id: '',
      name: '',
      desc: '',
      price: '',
      discount: '',
      file: '',
      fileName: '',
      page: 1,
      search: '',
      subjects: [],
      pages: 0,
      loading: false
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getSubject();
      });
    }
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => { });
    }
    this.setState({ [e.target.name]: e.target.value }, () => { });
    if (e.target.name === 'search') {
      this.getSubject();
    }
  };

  getSubject = () => {
    this.setState({ loading: true });
    const params = new URLSearchParams(this.props.location.search)
    const url = global.config.i18n.url+'shop/subject?school=' + params.get("school");
    axios.get(url, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      const data = [];
      const Search = this.state.search.toLowerCase();
      res.data.subjects.map((subject) => {
        if(myMatch(subject.name.toLowerCase(),Search)  || myMatch(subject.code.toLowerCase(),Search)  || Search===''){
            data.push(subject);
        }
      });
      this.setState({ loading: false, subjects: data, pages: res.data.pages });
    }).catch((err) => {
      swal({
        text:   err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false, products: [], pages: 0 },()=>{});
    });
  }
  changeToDashboard = () =>{
    this.props.history.push('/dashboard');
  }
  logOut = () => {
    localStorage.setItem('token', null);
    this.props.history.push('/');
  }
  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getSubject();
    });
  }
  clear = () =>{
    if(document.getElementsByClassName("TableBody")[0]!==undefined){
      document.getElementsByClassName("TableBody")[0].remove();
    }
  }
  render() {
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
          <h2>Subject Shop</h2>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.changeToDashboard}
          >
            Dashboard
          </Button>
          <Button
            className="button_style"
            variant="contained"
            size="small"
            onClick={this.logOut}
          >
            Log Out
          </Button>
        </div>

        <TableContainer>
        <form>
          <TextField
              id="standard-basic"
              type="search"
              autoComplete="off"
              name="search"
              value={this.state.search}
              onChange={this.onChange}
              placeholder="Search by subject"
              required
            />
        </form>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Subjects Name</TableCell>
              </TableRow>
            </TableHead>
            {this.clear}
            <TableBody class = "TableBody">
              {this.state.subjects.map((row) => {
                const url = "/shop/course?" + "subject=" + row.code + "&school="+row.school;
                return (
                <TableRow key={row.name}>
                  <TableCell align="center"><a href={url}>{row.name}({row.code})</a></TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
          <br />
          <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" />
        </TableContainer>
      </div>
    );
  }
}
