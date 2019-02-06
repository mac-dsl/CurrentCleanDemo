import React, { Component } from 'react';

export default class Test extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isRepaired: false,
           
        }
        this.handleClickCell = this.handleClickCell.bind(this)
        this.handleClickRepair = this.handleClickRepair.bind(this)
        this.handleClickCellFalse = this.handleClickCellFalse.bind(this)
    }
    handleClick(sensorID, prop) {
        var url = "http://127.0.0.1:5000/duration?start=" + this.props.start + "&end=" + this.props.end + "&sensorID=" + sensorID + "&prop=" + prop
        window.console.log(url)
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    window.console.log(result)
                    this.setState({
                        data: result,
                        showPopUp: true
                    })
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    window.console.log(error)
                }
            )
    }

    handleClickRepair() {
        window.console.log("test")
        this.setState({
            isRepaired: true
        })
    }
    handleClickCell(e) {
        window.console.log(e)
        if (e.nativeEvent.which === 1) {
            console.log('Left click');
          } else if (e.nativeEvent.which === 3) {
            console.log('Right click');
          }
    }
    handleClickCellFalse() {
        window.console.log("false")
    }

    render() {
        window.console.log("asdsa")
        window.console.log(this.props.data)
        var dict = this.props.dictStale
        var valid_id = ['A434F11F1B05', 'A434F11EEE06', 'A434F11F1684', 'A434F11F1E86', 'A434F11EF48B', 'A434F11F2003',
            'A434F11EEF0E', 'A434F11EA281', 'A434F11F1D06', 'A434F11F1000', 'A434F11F1606', 'A434F11FF78E',
            'A434F11F3681', 'A434F11F0C80', 'A434F11F1B88', 'A434F11EF609', 'A434F11FFE0D', 'A434F11F1B8A',
            'A434F1201380', 'A434F11F1B07', 'A434F11F0E06', 'A434F11F2F84', 'A434F11F1001', 'A434F11A3408',
            'A434F1204007', 'A434F11EA080', 'A434F1201282', 'A434F11EF80D', 'A434F11F1404', 'A434F11F1486',
            'A434F11F1683', 'A434F11F1A0A', 'A434F11F1783', 'A434F11F118D', 'A434F11EEB80', 'A434F11F0E83',
            'A434F11F1083', 'A434F11F1B84', 'A434F11F1D04', 'A434F11F1482', 'A434F11F1187', 'A434F11F1C85',
            'A434F1204005', 'A434F11F1F03', 'A434F11F3902', 'A434F11EF68F', 'A434F11F1106', 'A434F11F1782',
            'A434F11F1607', 'A434F11F4287', 'A434F11F1F02', 'A434F11F1406', 'A434F11F0E85', 'A434F11EEF8C',
            'A434F11F1E09', 'A434F11F0E03', 'A434F11F1483', 'A434F11F1F85']
        return (
            <div>
            <table className="table table-striped" id="age">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">SensorID</th>
                        <th scope="col">Temperature</th>
                        <th scope="col">Humidity</th>
                        <th scope="col">AirPressure</th>
                        <th scope="col">Voltage</th>
                    </tr>
                </thead>
                <tbody>{this.props.data.map(function (item, key) {

                    return (

                        <tr key={key} >
                            <td>{key + 1}</td>
                            <td>{item["sensorID"]}</td>

                            <td 
                                contentEditable={this.state.isRepaired === true? "true" : null}
                                onContextMenu={(e) => this.state.isRepaired === true ? this.handleClickCell(e) : null} 
                                onClick={(e) => this.state.isRepaired === true ? this.handleClickCell(e) : null} 
                                style={{ cursor: this.state.isRepaired === true?  'pointer' : null , background: dict[item["sensorID"]].includes('Temperature')? '#f4424b' : null}}>
                                {item["temperature"]}
                                </td>
                            <td 
                                contentEditable={this.state.isRepaired === true? "true" : null}
                                onContextMenu={(e) => this.state.isRepaired === true ? this.handleClickCell(e) : null} 
                                onClick={(e) => this.state.isRepaired === true ? this.handleClickCell(e) : null} 
                                style={{ cursor: this.state.isRepaired === true?  'pointer' : null, background: dict[item["sensorID"]].includes('Humidity')? '#f4424b' : null}} >
                                {item["humidity"]}
                            </td>
                            <td 
                                contentEditable={this.state.isRepaired === true? "true" : null}
                                onContextMenu={(e) => this.state.isRepaired === true ? this.handleClickCell(e) : null} 
                                onClick={(e) => this.state.isRepaired === true ? this.handleClickCell(e) : null} 
                                style={{ cursor: this.state.isRepaired === true?  'pointer' : null , background: dict[item["sensorID"]].includes('AirPressure')? '#f4424b' : null}} >
                                {item["airPressure"]}
                            </td>
                            <td 
                                contentEditable={this.state.isRepaired === true? "true" : null}
                                onContextMenu={(e) => this.state.isRepaired === true ? this.handleClickCell(e) : null} 
                                onClick={(e) => this.state.isRepaired === true ? this.handleClickCell(e) : null} 
                                style={{ cursor: this.state.isRepaired === true?  'pointer' : null , background: dict[item["sensorID"]].includes('Voltage')? '#f4424b' : null}} >
                                {item["voltage"]}
                            </td>
                        </tr>
                    )

                }.bind(this))}</tbody>
            </table>
            <input onClick={this.handleClickRepair}  id="identify" className="btn btn-primary" type="button" value="Repair"></input>
            
            </div>
        )

    }

}