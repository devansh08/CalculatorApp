import React, { Component } from 'react';
import io from 'socket.io-client';
import $ from 'jquery';

import './Main.css';

const serverIp = "http://" + process.env.REACT_APP_SERVER_IP + ":" + process.env.REACT_APP_SERVER_PORT;
const socket = io(serverIp);

export default class Main extends Component {
    constructor(props) {
        super(props);

        this.handleOperatorButtons = this.handleOperatorButtons.bind(this);
        this.handleClearButton = this.handleClearButton.bind(this);
    }

    componentDidMount() {
        socket.on('calc_performed', (data) => {
            document.getElementById('log').value = data.addr + ' :\t\t' + data.calc['operands'][0] + ' ' + data.calc['operator'] + ' ' + data.calc['operands'][1] + '\t\t=\t\t' + data.res + '\n' + document.getElementById('log').value;
        });

        socket.on('clear_db', () => {
            this.getCalcs();
        })

        this.getCalcs();
    }

    getCalcs() {
        $.ajax({
            url: serverIp + '/calcs',
            type: 'GET',
            success: (data) => {
                document.getElementById('log').value = '';
                data.forEach(element => {
                    document.getElementById('log').value += element['user'] + ' :\t\t' + element['expr'] + '\t\t=\t\t' + element['res'] + '\n';
                });
            },
            error: (xhr, status, err) => {
                console.log(err);
            }
        });
    }

    handleOperatorButtons(op) {
        $.ajax({
            url: serverIp + '/calcs',
            type: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                'operands': [ document.getElementById('op1').value, document.getElementById('op2').value ],
                'operator': op
            }),
            success: (data) => {
                document.getElementById('output').value = data;
            },
            error: (xhr, status, err) => {
                console.log(err);
            }
        });

        this.getCalcs();
    }

    handleClearButton() {
        $.ajax({
            url: serverIp + '/cleardb',
            type: 'GET',
            success: (data) => {
                this.getCalcs();
            }
        });
    }

    render() {
        return (
            <div className="App">
                <div className={"container-fluid"}>
                    <header className="AppHeader">
                        <div className={"jumbotron"} id="jumbo">
                            <div id="title">Calculator</div>
                        </div>
                    </header>
                    <div id="operands" className={"row justify-content-center"}>
                        <div className={"col-md-2"}><input className={"form-control"} type="number" id="op1" placeholder="Operand 1"></input></div>
                        <div className={"col-md-2"}><input className={"form-control"} type="number" id="op2" placeholder="Operand 2"></input></div>
                    </div>
                    <div id="operators" className={"row justify-content-center"}>
                        <div className={"col-md-1"}>
                            <button type="button" className={"btn btn-outline-primary btn-block"} onClick={this.handleOperatorButtons.bind(this, "+")}>+</button>
                        </div>
                        <div className={"col-md-1"}>
                            <button type="button" className={"btn btn-outline-primary btn-block"} onClick={this.handleOperatorButtons.bind(this, "-")}>-</button>
                        </div>
                        <div className={"col-md-1"}>
                            <button type="button" className={"btn btn-outline-primary btn-block"} onClick={this.handleOperatorButtons.bind(this, "*")}>*</button>
                        </div>
                        <div className={"col-md-1"}>
                            <button type="button" className={"btn btn-outline-primary btn-block"} onClick={this.handleOperatorButtons.bind(this, "/")}>/</button>
                        </div>
                    </div>
                    <div id="results" className={"row justify-content-center"}>
                        <div className={"col-md-4"}><input type="text" className={"form-control"} id="output" placeholder="Result" readOnly></input></div>
                    </div>
                    <div id="logs" className={"row justify-content-center"}>
                        <div className={"col-md-4"}><textarea id="log" rows="10" className={"form-control"} placeholder="Calculations" readOnly></textarea></div>
                    </div>
                    <div id="cleardb" className={"row justify-content-center"}>
                        <button type="button" className={"btn btn-primary"} onClick={this.handleClearButton.bind(this)}>Clear DB</button> 
                    </div>
                </div>
            </div>
        )
    }
}
