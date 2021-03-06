import React, { Component } from 'react';
import '../CSS/TableFregAge.css'
import * as constClass from '../Const/utils.js'
import Popup from "reactjs-popup";
import $ from 'jquery';
import { Chart } from "react-charts";
import CanvasJSReact from '../Chart/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var arrayCells = []
const contentStyle = {
  height: "40vh",
  width: "25%"
};

export default class TableFregAge extends Component {


  constructor(props) {
    super(props)

    this.state = {
      showPopUp: false,
      data: [],
      dataCanvas: [],
      dataLineChart: [],
      typechart: '',
      currentID:'',
      currentProp: '',
      valueForm:'',
      dataUpdateCount: [],
      dataUpdateCountInterval: [],
      interval: 0,
      max: 0,
      stripLines: [],
      

    }
    this.myRef = React.createRef();
    this.handleClick = this.handleClick.bind(this)
    this.closePopUp = this.closePopUp.bind(this)
    this.keydownHandler = this.keydownHandler.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.timeConverter = this.timeConverter.bind(this)
  }
  timeConverter = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    window.console.log(hour)
    if (hour.toString().length === 1) {
        window.console.log("hour")
        hour = "0" + hour.toString()
    }
    var min = a.getMinutes();
    var sec = a.getSeconds();
    if (min.toString().length === 1) {
        min = "0" + min.toString()
    }
    if (sec.toString().length === 1) {
        sec = "0" + sec.toString()
    }
    // var time = month + ' ' + date + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    var time = year + '/' + month + '/' + date + ' ' + hour + ':' + min + ':' + sec ;
    
    return time;
  }
  convertListOfTimeStamp = (data) => {
    for (var i=0; i<data.length; i++) {
      data[i]["x"] = this.timeConverter(data[i]["x"])
    }
    return data
  }
  createLineChartData(response) {
    window.console.log("response[0]")
    window.console.log(arrayCells)
    var array = []
    for (var i = 0; i < arrayCells.length; i++) {
      var temp = {}
      var key = Object.keys(arrayCells[i])[0]
      temp.type = "line"
     
      if (this.props.typeRadio === constClass.SENSOR) {
        temp.name ="sensor_" + key + "_" + arrayCells[i][key]
      }
      else if (this.props.typeRadio === constClass.CLINICAL) {
        temp.name ="patient_" + key + "_" + arrayCells[i][key]
        // temp.legendText = "WBC"
        
      }
      temp.showInLegend = true
      temp.toolTipContent = "Time {x}: {y}"
      
      temp.dataPoints = response[i]
      array.push(temp)
    }
    this.setState({
      dataLineChart: array
    })




  }
  
  resetSelectedCells() {
    var temp = this.state.data
    for (var i = 0; i < arrayCells.length; i++) {
      var row = arrayCells[i]["row"]
      var col = arrayCells[i]["col"]
      temp[row][col]["isSelected"] = false

    }
    arrayCells = []
    this.setState({
      data: temp
    })
  }
  keydownHandler(e) {
    if (this.props.typeRadio === constClass.SENSOR) {
      if (e.keyCode === 13 && e.metaKey || e.keyCode === 13 && e.ctrlKey ) {
        window.console.log(constClass.LOCAL_BACKEND + "comparecells")
  
        fetch(constClass.LOCAL_BACKEND + 'comparecells?dataset=' + constClass.SENSOR , {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(
            {
              "start": this.props.start,
              "end": this.props.end,
              "arrayCells": arrayCells
            }),
  
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
          .then(response => {
            console.log("responseCompareCells")
            this.createLineChartData(response)
            this.setState({
  
              showPopUp: true,
              typechart: constClass.AGELINECHART
  
             
            })
            
          })
          .catch(error => console.error('Error:', error));
  
      }
      else if (e.keyCode === 27 && e.metaKey) {
        this.resetSelectedCells()
      }
    }
    else if (this.props.typeRadio === constClass.CLINICAL) {
      if (e.keyCode === 13 && e.metaKey || e.keyCode === 13 && e.ctrlKey) {
        window.console.log(constClass.LOCAL_BACKEND + "comparecells")
  
        fetch(constClass.LOCAL_BACKEND + 'comparecells?dataset=' + constClass.CLINICAL , {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(
            {
              "start": this.props.start,
              "end": this.props.end,
              "arrayCells": arrayCells
            }),
  
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
          .then(response => {
  
            this.createLineChartData(response)
            this.setState({
  
              showPopUp: true,
              typechart: constClass.AGELINECHART
  
             
            })
            
          })
          .catch(error => console.error('Error:', error));
  
      }
      else if (e.keyCode === 27 && e.metaKey) {
        this.resetSelectedCells()
      }
    }
    
  }
  
  componentDidMount() {
    document.addEventListener('keydown', this.keydownHandler);
    document.addEventListener("mousedown", this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydownHandler);
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  newHexColor = (data) => {
    console.log("92")
    console.log(data)
    for (var i=0; i<data.length; i++) {
      for (var j=0; j<data[0].length; j++)
      {
        var probability = data[i][j]["probability"]
       
        // if (probability >= 0 && probability <= 0.14285714285714285 ) {
        //   data[i][j]["hex"] = "#67001f"
        // }
        // else if (probability >= 0.14285714285714285 && probability <= 0.2857142857142857 ) {
        //   data[i][j]["hex"] = "#980043"
        // }
        // else if (probability >= 0.2857142857142857 && probability <= 0.42857142857142855 ) {
        //   data[i][j]["hex"] = "#ce1256"
        // }
        // else if (probability >= 0.42857142857142855 && probability <= 0.5714285714285714 ) {
        //   data[i][j]["hex"] = "#e7298a"
        // }
        // else if (probability >= 0.5714285714285714 && probability <= 0.7142857142857142 ) {
        //   data[i][j]["hex"] = "#df65b0"
        // }
        // else if (probability >= 0.7142857142857142 && probability <= 0.857142857142857 ) {
        //   data[i][j]["hex"] = "#c994c7"
        // }
        // else if (probability >= 0.857142857142857 && probability <= 1.0 ) {
        //   data[i][j]["hex"] = "#d4b9da"
        // }


        // if (probability >= 0 && probability <= 0.14285714285714285 ) {
        //   data[i][j]["hex"] = "#00441b"
        // }
        // else if (probability >= 0.14285714285714285 && probability <= 0.2857142857142857 ) {
        //   data[i][j]["hex"] = "#006d2c"
        // }
        // else if (probability >= 0.2857142857142857 && probability <= 0.42857142857142855 ) {
        //   data[i][j]["hex"] = "#238b45"
        // }
        // else if (probability >= 0.42857142857142855 && probability <= 0.5714285714285714 ) {
        //   data[i][j]["hex"] = "#41ab5d"
        // }
        // else if (probability >= 0.5714285714285714 && probability <= 0.7142857142857142 ) {
        //   data[i][j]["hex"] = "#74c476"
        // }
        // else if (probability >= 0.7142857142857142 && probability <= 0.857142857142857 ) {
        //   data[i][j]["hex"] = "#a1d99b"
        // }
        // else if (probability >= 0.857142857142857 && probability <= 1.0 ) {
        //   data[i][j]["hex"] = "#c7e9c0"
        // }

        if (probability >= 0 && probability <= 0.14285714285714285 ) {
          data[i][j]["hex"] = "#08306b"
        }
        else if (probability >= 0.14285714285714285 && probability <= 0.2857142857142857 ) {
          data[i][j]["hex"] = "#08519c"
        }
        else if (probability >= 0.2857142857142857 && probability <= 0.42857142857142855 ) {
          data[i][j]["hex"] = "#2171b5"
        }
        else if (probability >= 0.42857142857142855 && probability <= 0.5714285714285714 ) {
          data[i][j]["hex"] = "#4292c6"
        }
        else if (probability >= 0.5714285714285714 && probability <= 0.7142857142857142 ) {
          data[i][j]["hex"] = "#6baed6"
        }
        else if (probability >= 0.7142857142857142 && probability <= 0.857142857142857 ) {
          data[i][j]["hex"] = "#9ecae1"
        }
        else if (probability >= 0.857142857142857 && probability <= 1.0 ) {
          data[i][j]["hex"] = "#c6dbef"
        }
      }
     
    }
    return data
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      //Perform some operation
      arrayCells = []
      window.console.log("90")
      window.console.log(nextProps.data)
      var newHexData = this.newHexColor(nextProps.data)
      
      this.setState({ data: newHexData });

    }
  }

  convertToArrayObject(data) {
    var array = []
    for (var i = 0; i < data.length; i++) {
      var y = data[i][1]
      var label = data[i][0]
      var object = { label: label, y }
      array.push(object)
    }
    window.console.log('array')
    window.console.log(array)
    console.log("typeChart")
    console.log(this.state.typechart)
    if (this.state.typechart === constClass.AGEBARCHART) {
      for (var j=0; j<array.length; j++) {
        array[j].y = array[j].y / 60
      }
    }
    this.setState({
      dataCanvas: array,
      
    })
  }
 


  handleClick(event, sensorID, prop, row, col,checkInTheSameCol) {
    // event.stopPropagation();
    
    this.setState({
      currentID: sensorID,
      currentProp: prop
    })

    if (this.props.typeRadio === constClass.SENSOR) {
      if (this.props.typeRequest === constClass.FREQUENCY) {
      
     
        this.resetSelectedCells()
        var url = constClass.LOCAL_BACKEND + "duration?start=" + this.props.start + "&end=" + this.props.end + "&sensorID=" + sensorID + "&prop=" + prop + "&dataset=" + constClass.SENSOR
        window.console.log(url)
        fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
              window.console.log('*********')
              window.console.log(result)
              
              this.setState({
                showPopUp: true,
                typechart: constClass.FREQBARCHART
              }, () => this.convertToArrayObject(result) )
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              window.console.log(error)
            }
          )
        
      
  
    }
    else if (this.props.typeRequest === constClass.AGE) {
      if (event.metaKey || event.ctrlKey) { //if (event.metaKey && checkInTheSameCol === true)
        window.console.log("event keycode:")
        window.console.log(event.keyCode)
        var temp = this.state.data
        temp[row][col]["isSelected"] = !temp[row][col]["isSelected"]
        if (temp[row][col]["isSelected"] === true) {
          var cell = {}
          cell[sensorID] = prop
          cell["row"] = row
          cell["col"] = col
          arrayCells.push(cell)
        } else {
          for (var i = 0; i < arrayCells.length; i++) {
            var key = Object.keys(arrayCells[i])[0]
            if (key === sensorID && arrayCells[i][key] === prop) {
              arrayCells.splice(i, 1);
            }
          }
        }
  
        this.setState({
          data: temp
        })
      } else if (event.metaKey === false) {
        var url2 = constClass.LOCAL_BACKEND + "existedtime?start=" + this.props.start + "&end=" + this.props.end + "&sensorID=" + sensorID + "&prop=" + prop + "&dataset=" + constClass.SENSOR
        window.console.log(url2)
        fetch(url2)
          .then(res => res.json())
          .then(
            (result) => {
              window.console.log('*********')
              window.console.log(result)
             
              this.setState({
                showPopUp: true,
                typechart: constClass.AGEBARCHART
              }, () =>  this.convertToArrayObject(result) )
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              window.console.log(error)
            }
          )
      }
      
    }
    }
    else if (this.props.typeRadio === constClass.CLINICAL) {
      if (this.props.typeRequest === constClass.FREQUENCY) {
      
     
        this.resetSelectedCells()
        var url = constClass.LOCAL_BACKEND + "duration?start=" + this.props.start + "&end=" + this.props.end + "&sensorID=" + sensorID + "&prop=" + prop + "&dataset=" + constClass.CLINICAL
        window.console.log(url)
        fetch(url)
          .then(res => res.json())
          .then(
            (result) => {
              window.console.log('*********')
              window.console.log(result)
              
              this.setState({
                showPopUp: true,
                typechart: constClass.FREQBARCHART
              },  () =>  this.convertToArrayObject(result) )
             
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              window.console.log(error)
            }
          )
        
      
  
    }
    else if (this.props.typeRequest === constClass.AGE) {
      if (event.metaKey || event.ctrlKey) {
        var temp = this.state.data
        temp[row][col]["isSelected"] = !temp[row][col]["isSelected"]
        if (temp[row][col]["isSelected"] === true) {
          var cell = {}
          cell[sensorID] = prop
          cell["row"] = row
          cell["col"] = col
          arrayCells.push(cell)
        } else {
          for (var i = 0; i < arrayCells.length; i++) {
            var key = Object.keys(arrayCells[i])[0]
            if (key === sensorID && arrayCells[i][key] === prop) {
              arrayCells.splice(i, 1);
            }
          }
        }
  
        this.setState({
          data: temp
        })
      } else if (event.metaKey === false) {
        var url2 = constClass.LOCAL_BACKEND + "existedtime?start=" + this.props.start + "&end=" + this.props.end + "&sensorID=" + sensorID + "&prop=" + prop + "&dataset=" + constClass.CLINICAL
        window.console.log(url2)
        fetch(url2)
          .then(res => res.json())
          .then(
            (result) => {
              window.console.log('*********')
              window.console.log(result)
              this.convertToArrayObject(result)
              this.setState({
                showPopUp: true,
                typechart: constClass.AGEBARCHART
              }, () =>  this.convertToArrayObject(result) )
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              window.console.log(error)
            }
          )
      }
    }
    }
    
    
  }
  closePopUp() {
    this.setState({
      showPopUp: false


    })
  }
  addSymbols(e) {
    var suffixes = ["", "K", "M", "B"];
    var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
    if (order > suffixes.length - 1)
      order = suffixes.length - 1;
    var suffix = suffixes[order];
    return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
  }
  checkInTheSameCol(colCheck) {
    if (arrayCells.length > 0) {
      window.console.log(arrayCells[0])
      var col = arrayCells[0]["col"]
      window.console.log(col)
      window.console.log(colCheck)

      if (colCheck === col) {
        return true
      }
      else {
        return false
      }

    }
    return true
  }
 
  handleClickInside = () => {
      window.console.log("inside")
  }
  handleClickOutside(e)  {
    window.console.log("this.myRef.current")
    window.console.log(this.myRef.current)
    if (this.myRef.current !== null) {
      if (!this.myRef.current.contains(e.target)) {
          this.resetSelectedCells()
        }
    }
    // if (!this.myRef.current.contains(e.target)) {
    //   window.console.log("outside")
    // }
  };

  handleChangeForm = (event) => {
    event.preventDefault()
    this.setState({valueForm: event.target.value});
  }

  handleSubmitForm = (event) => {

    if (this.props.typeRadio === constClass.SENSOR) {
      var url = constClass.LOCAL_BACKEND + "updateCount?start=" + this.props.start + "&end=" + this.props.end + "&id=" + this.state.currentID + "&attr=" + this.state.currentProp +"&value=" +this.state.valueForm+ "&dataset=" + constClass.SENSOR
      window.console.log(url)
      fetch(url)
        .then(res => res.json())
        .then(
          (result) => {
            window.console.log('*********')
            window.console.log(result)
            // this.convertToArrayObject(result)
            this.createLineChartDataUpdateCount(result)
            this.setState({
              
              typechart: constClass.UPDATECOUNTCHART
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
    else if (this.props.typeRadio === constClass.CLINICAL) {
      var url = constClass.LOCAL_BACKEND + "updateCount?start=" + this.props.start + "&end=" + this.props.end + "&id=" + this.state.currentID + "&attr=" + this.state.currentProp +"&value=" +this.state.valueForm+ "&dataset=" + constClass.CLINICAL
      window.console.log(url)
      fetch(url)
        .then(res => res.json())
        .then(
          (result) => {
            window.console.log('*********')
            window.console.log(result)
            // this.convertToArrayObject(result)
            this.createLineChartDataUpdateCount(result)
            this.setState({
              
              typechart: constClass.UPDATECOUNTCHART
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
    
    event.preventDefault();
  }
  handleClickBarChart = () => {
    alert('A name was submitted: ' + this.state.valueForm);
  }
  createLineChartDataUpdateCount(response) {
    var relativeUpdates = response["relativeUpdates"]
    var dataPoints = []
    var dataPointsInterval = []
    
    var count = 0
    var sum = 0
    var intervalCounts = response["intervalCounts"]
    
    console.log()
    for (var j=0; j<intervalCounts.length; j++) {
      sum += intervalCounts[j]
    }
    var max2 = -9999
    for (var i=0; i<relativeUpdates.length; i++) {
      var temp = {}
      temp.x = relativeUpdates[i][1]
      temp.y = relativeUpdates[i][0]
      dataPoints.push(temp)
      if (relativeUpdates[i][0] > max2) {
        max2 = relativeUpdates[i][0]
      }
      
    }
    
    var check = relativeUpdates[0][1]
    var step = (relativeUpdates[relativeUpdates.length-1][1] -  relativeUpdates[0][1])/ (intervalCounts.length )
    var step2 = (relativeUpdates[relativeUpdates.length-1][1] -  relativeUpdates[0][1])/ (intervalCounts.length )
    


    var temp2 = {}
    temp2.x = relativeUpdates[0][1]
    temp2.y = max2 + 0.6
    temp2.markerSize = 14
    dataPointsInterval.push(temp2)

    for (var k=0; k<intervalCounts.length; k++) {
      var temp = {}
      temp.x = check + step
      temp.y = max2  + 0.6
      dataPointsInterval.push(temp)
      check += step
      temp.indexLabel = "+" + intervalCounts[k].toString()
      temp.markerSize = 14

    }
    console.log("intervalCounts")
    console.log(dataPoints)
    console.log(dataPointsInterval)
    console.log(step2)
    console.log(parseInt(step2) * intervalCounts.length + relativeUpdates[0][1])

    var max = parseInt(step2) * intervalCounts.length + relativeUpdates[0][1]
    for (var v=0; v<dataPoints.length; v++) {
      if (dataPoints[v].x > max) {
        dataPoints.splice(v,1)
      }
    }

    var stripLines = []
    for (var c=0; c<dataPointsInterval.length; c++) {
      var value = {}
      value.value = dataPointsInterval[c]["x"]
      value.lineDashType = "dash"
      stripLines.push(value)
    }

    console.log("stripLines")
    console.log(stripLines)

    this.setState({
      dataUpdateCount: dataPoints,
      dataUpdateCountInterval: dataPointsInterval,
      interval: parseInt(step2),
      max: parseInt(step2) * intervalCounts.length + relativeUpdates[0][1],
      stripLines: stripLines
    })




  }
 
  render() {
    var x = this.checkInTheSameCol(1)
    window.console.log("checkInTheSameCol")
    window.console.log(x)
    console.log("this.state.data")
    console.log(this.state.data)

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
    
    var valid_id_Mimic = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100']
    window.console.log("this.state.dataLineChart")
    window.console.log(this.state.dataLineChart)
    const lineChart = (
      // A react-chart hyper-responsively and continuusly fills the available
      // space of its parent element automatically
      <div
        style={{
          width: "400px",
          height: "300px"
        }}
      >
        <Chart
          data={[
            {
              label: "Series 1",
              data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
            },
            {
              label: "Series 2",
              data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
            }
          ]}
          axes={[
            { primary: true, type: "linear", position: "bottom" },
            { type: "linear", position: "left" }
          ]}
        />
      </div>
    );

    const optionsLineChartAge = {
      animationEnabled: true,
      exportEnabled: true,
      theme: "light2", // "light1", "dark1", "dark2"
      title: {
         fontFamily: "tahoma",
        text: "Comparative Evolution"
      },
      legend: {
        fontSize: 30
      },
      axisY: {
        
        titleFontSize: 25,
        includeZero: false,
        labelFontSize: 25

      },
      axisX: {
        title: "Time",
        
        labelFormatter: function(e){
          
          console.log("e value")
          console.log(e)
          var a = new Date(e.value * 1000);
          var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
          var year = a.getFullYear();
          var month = months[a.getMonth()];
          var date = a.getDate();
          var hour = a.getHours();
          window.console.log(hour)
          
          var min = a.getMinutes();
          var sec = a.getSeconds();
          if (min.toString().length === 1) {
              min = "0" + min.toString()
          }
          if (sec.toString().length === 1) {
              sec = "0" + sec.toString()
          }
          // var time = month + ' ' + date + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
          if (parseInt(hour) > 12) {
            hour = (parseInt(hour) - 12).toString() + "pm"
          }
          else {
            hour = hour + "am"
          }
          var time = hour ;
          

          
          return time;
        },
        titleFontSize: 25,
        includeZero: false,
        labelFontSize: 25

      },

      data: this.state.dataLineChart
      ,

    }
    let optionsColumnAge = {
      animationEnabled: true,
      exportEnabled: true,
     
      title: {
        text: "Total time"
      },
      subtitles: [{
        text: this.props.typeRadio===constClass.CLINICAL ? "patient_"+ this.state.currentID + "_" + this.state.currentProp : "sensor_" + this.state.currentID + "_" + this.state.currentProp ,		
        fontSize : 20
       
      }],
      
      axisX: {
        title: "Values",
        reversed: true,
        titleFontSize: 20,
        
        labelFontSize: 20
      },
      axisY: {
        title: "Time (minutes)",
        labelFormatter: this.addSymbols,
        titleFontSize: 20,
        
        labelFontSize: 20
      },
      data: [
        {
          // Change type to "doughnut", "line", "splineArea", etc.
          type: "column",
       
          dataPoints: this.state.dataCanvas
        }
      ]
    }
    const optionsColumnFreq = {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Frequently updated values",
        fontSize: 40,
      },
      axisX: {
        title: "Value",
        reversed: true,
        titleFontSize: 25,
        includeZero: false,
        labelFontSize: 25
      },
      axisY: {
        title: "Update frequency",
        labelFormatter: this.addSymbols,
        titleFontSize: 25,
        includeZero: false,
        labelFontSize: 25
      },
      data: [
        {
          // Change type to "doughnut", "line", "splineArea", etc.
          type: "column",
          dataPoints: this.state.dataCanvas
        }
      ]
    }
    const optionsUpdateCount = {
      animationEnabled: true,
     
			colorSet: "colorSet2",
      exportEnabled: true,
     
      axisX:{
        stripLines: this.state.stripLines,
        title: "Time",
        interval: this.state.interval,
        titleFontSize: 25,
        includeZero: false,
        labelFontSize: 25,
        labelFormatter: function(e){
          
          console.log("e value")
          console.log(e)
          var a = new Date(e.value * 1000);
          var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
          var year = a.getFullYear();
          var month = months[a.getMonth()];
          var date = a.getDate();
          var hour = a.getHours();
          window.console.log(hour)
          
          var min = a.getMinutes();
          var sec = a.getSeconds();
          if (min.toString().length === 1) {
              min = "0" + min.toString()
          }
          if (sec.toString().length === 1) {
              sec = "0" + sec.toString()
          }
          // var time = month + ' ' + date + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
          if (parseInt(hour) > 12) {
            hour = (parseInt(hour) - 12).toString() + "pm"
          }
          else {
            hour = hour + "am"
          }
          var time = hour ;
          

          
          return time;
        },
        
        
       },
       axisY:{
        title: "Change %",
        labelFormatter: function(e){
          return e.value ;
        },
        titleFontSize: 25,
        gridThickness: 0,
        includeZero: false,
        labelFontSize: 25
      },
       legend: {
        fontSize: 30,
        verticalAlign: "top",
        horizontalAlign: "right"  // "top" , "bottom"
      },
      toolTip:{
        enabled: false   //enable here
      },
			data: [{
        type: "spline",
        
        dataPoints: this.state.dataUpdateCount
      },
      {
        type: "spline",
        lineDashType: "dash",
        indexLabelFontSize: 25,
        markerType:"cross",
        
        dataPoints: this.state.dataUpdateCountInterval
      }
      
      // {
			// 	type: "column",
			// 	name: "Actual Sales",
			// 	showInLegend: true,
			// 	xValueFormatString: "MMMM YYYY",
			// 	yValueFormatString: "$#,##0",
			// 	dataPoints: [
			// 		{ x: new Date(2017, 0), y: 27500 ,indexLabel : "some label" },
			// 		{ x: new Date(2017, 1), y: 29000 ,label : "some label" },
			// 		{ x: new Date(2017, 2), y: 22000 },
			// 		{ x: new Date(2017, 3), y: 26500 },
			// 		{ x: new Date(2017, 4), y: 33000 },
			// 		{ x: new Date(2017, 5), y: 37000 },
			// 		{ x: new Date(2017, 6), y: 32000 },
			// 		{ x: new Date(2017, 7), y: 27500 },
			// 		{ x: new Date(2017, 8), y: 29500 },
			// 		{ x: new Date(2017, 9), y: 43000 },
			// 		{ x: new Date(2017, 10), y: 55000, indexLabel: "High Renewals" },
			// 		{ x: new Date(2017, 11), y: 39500 }
			// 	]
			// }
      ]
		}
   
    var typeRequest = this.props.typeRequest
    var data = this.props.data
    return (

      <div className="TableFregAge" id="table">
        <ul className="nav nav-tabs" style={{ width: "100%" }}>
          <li id="boldAge" className={this.props.typeRequest === constClass.AGE ? "active li" : "li"}><a href="#" id={constClass.AGE} onClick={this.props.onClick}>Historical values</a></li>

          <li id="boldFreq" className={this.props.typeRequest === constClass.FREQUENCY ? "active li" : "li"} ><a href="#" onClick={this.props.onClick} id={constClass.FREQUENCY}>Update Frequency</a></li>

        </ul>
        {this.props.typeRadio === constClass.SENSOR ? (this.props.data.length === 58 ?  
        
        <table ref={this.myRef} onClick={this.handleClickInside} className="table table-striped" id="freq">
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
          
            <tbody>{this.state.data.map(function (item, key) {

              return (


                <tr key={key} >
                  <td>{key + 1}</td>
                  <td>{valid_id[key]}</td>

                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id[key], 'temperature', key, 0,this.checkInTheSameCol(0)) } style={{color: item[0]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[0]["isSelected"] === false ? item[0]["hex"] : "#38ff5f" }}  >{item[0]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id[key], 'humidity', key, 1,this.checkInTheSameCol(1)) } style={{color: item[1]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[1]["isSelected"] === false ? item[1]["hex"] : "#38ff5f" }} >{item[1]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id[key], 'airPressure', key, 2,this.checkInTheSameCol(2)) } style={{color: item[2]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[2]["isSelected"] === false ? item[2]["hex"] : "#38ff5f" }} >{item[2]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id[key], 'voltage', key, 3,this.checkInTheSameCol(3)) } style={{color: item[3]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[3]["isSelected"] === false ? item[3]["hex"] : "#38ff5f" }} >{item[3]["value"]}</td>
                </tr>

              )

            }.bind(this))}</tbody>
          

        </table> : null)
        : (this.props.data.length === valid_id_Mimic.length ? 
        <div id="tableMimicFreqAge"> 
        <table ref={this. myRef}  className="table table-striped">
          <thead>
            <tr>
            <th scope="col">ID</th>
              
            <th scope="col">TMP</th>
            <th scope="col">SpO2</th>
              <th scope="col">HR</th>
              <th scope="col">DBP</th>
              <th scope="col">SBP</th>
              <th scope="col">WBC</th>
              <th scope="col">RR</th>
             
             
              <th scope="col">RBC</th>
              <th scope="col">RBCF</th> 
              <th scope="col">MONO</th>
             
              <th scope="col">WT</th>
              <th scope="col">LDL</th>
              <th scope="col">HDL</th>
              <th scope="col">ABE</th>
              <th scope="col">ACO2</th>
              <th scope="col">APH</th>
              <th scope="col">Hb</th>
              

                         
              <th scope="col">CVP</th>
              
              <th scope="col">EOS</th>
              <th scope="col">LY</th>
              <th scope="col">RDW</th>
              <th scope="col">TC</th>
            </tr>
          </thead>
          
            <tbody>{this.state.data.map(function (item, key) {

              return (


                <tr key={key} >
            
                  <td>{valid_id_Mimic[key]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'TMP', key, 9,this.checkInTheSameCol(9)) } style={{color: item[9]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[9]["isSelected"] === false ? item[9]["hex"] : "#38ff5f" }} >{item[9]["value"]}</td>
                  
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'SpO2', key, 8,this.checkInTheSameCol(8)) } style={{color: item[8]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[8]["isSelected"] === false ? item[8]["hex"] : "#38ff5f" }}  >{item[8]["value"]}</td>

                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'HR', key, 3,this.checkInTheSameCol(3)) } style={{color: item[3]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[3]["isSelected"] === false ? item[3]["hex"] : "#38ff5f" }} >{item[3]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'DBP', key, 4,this.checkInTheSameCol(4)) } style={{color: item[4]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[4]["isSelected"] === false ? item[4]["hex"] : "#38ff5f" }}  >{item[4]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'SBP', key, 5,this.checkInTheSameCol(5)) } style={{color: item[5]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[5]["isSelected"] === false ? item[5]["hex"] : "#38ff5f" }} >{item[5]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'WBC', key, 16,this.checkInTheSameCol(16)) } style={{color: item[16]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[16]["isSelected"] === false ? item[16]["hex"] : "#38ff5f" }}  >{item[16]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'RR', key, 7,this.checkInTheSameCol(7)) } style={{color: item[7]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[7]["isSelected"] === false ? item[7]["hex"] : "#38ff5f" }} >{item[7]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'RBC', key, 14,this.checkInTheSameCol(14)) } style={{color: item[14]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[14]["isSelected"] === false ? item[14]["hex"] : "#38ff5f" }} >{item[14]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'RBCF', key, 15,this.checkInTheSameCol(15)) } style={{color: item[15]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[15]["isSelected"] === false ? item[15]["hex"] : "#38ff5f" }} >{item[15]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'MONO', key, 17,this.checkInTheSameCol(17)) } style={{color: item[17]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[17]["isSelected"] === false ? item[17]["hex"] : "#38ff5f" }} >{item[17]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'WT', key, 0,this.checkInTheSameCol(0)) } style={{color: item[0]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[0]["isSelected"] === false ? item[0]["hex"] : "#38ff5f" }}  >{item[0]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'LDL', key, 1,this.checkInTheSameCol(1)) } style={{color: item[1]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[1]["isSelected"] === false ? item[1]["hex"] : "#38ff5f" }} >{item[1]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'HDL', key, 2,this.checkInTheSameCol(2)) } style={{color: item[2]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[2]["isSelected"] === false ? item[2]["hex"] : "#38ff5f" }} >{item[2]["value"]}</td>
                  
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'ABE', key, 10,this.checkInTheSameCol(10)) } style={{color: item[10]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[10]["isSelected"] === false ? item[10]["hex"] : "#38ff5f" }} >{item[10]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'ACO2', key, 11,this.checkInTheSameCol(11)) } style={{color: item[11]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[11]["isSelected"] === false ? item[11]["hex"] : "#38ff5f" }} >{item[11]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'APH', key, 12,this.checkInTheSameCol(12)) } style={{color: item[12]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[12]["isSelected"] === false ? item[12]["hex"] : "#38ff5f" }}  >{item[12]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'Hb', key, 13,this.checkInTheSameCol(13)) } style={{color: item[13]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[13]["isSelected"] === false ? item[13]["hex"] : "#38ff5f" }} >{item[13]["value"]}</td>
                  
                  
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'CVP', key, 6,this.checkInTheSameCol(6)) } style={{color: item[6]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[6]["isSelected"] === false ? item[6]["hex"] : "#38ff5f" }} >{item[6]["value"]}</td>           
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'EOS', key, 18,this.checkInTheSameCol(18)) } style={{color: item[18]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[18]["isSelected"] === false ? item[18]["hex"] : "#38ff5f" }} >{item[18]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'LY', key, 19,this.checkInTheSameCol(19)) } style={{color: item[19]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[19]["isSelected"] === false ? item[19]["hex"] : "#38ff5f" }} >{item[19]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'RDW', key, 20,this.checkInTheSameCol(20)) } style={{color: item[20]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[20]["isSelected"] === false ? item[20]["hex"] : "#38ff5f" }}  >{item[20]["value"]}</td>
                  <td className="td" onClick={(e) =>  this.handleClick(e, valid_id_Mimic[key], 'TC', key, 21,this.checkInTheSameCol(21)) } style={{color: item[21]["hex"] === "#08306b" ? "#ffffff" : null, cursor: 'pointer', background: item[21]["isSelected"] === false ? item[21]["hex"] : "#38ff5f" }} >{item[21]["value"]}</td>
                
                </tr>

              )

            }.bind(this))}</tbody>
          

        </table> </div>: null) }
        






        <Popup onClose={this.closePopUp} open={this.state.showPopUp} position="right center">
          <div className="table-wrapper-scroll-y2">
            {this.state.typechart === constClass.AGELINECHART ?
              <CanvasJSChart options={optionsLineChartAge} /> : (this.state.typechart === constClass.AGEBARCHART ? 
                <CanvasJSChart options={optionsColumnAge} />:  
                <CanvasJSChart options={optionsColumnFreq} />)}

            {this.state.typechart === constClass.FREQBARCHART || this.state.typechart === constClass.UPDATECOUNTCHART?
              <div>
                <form onSubmit={this.handleSubmitForm}>
                  <label className="baseLineClass smallPadding">
                    Baseline value:
                      <input id="baseline" type="text" value={this.state.valueForm} onChange={this.handleChangeForm} />
                  </label>
                  <input className="baseLineClass smallPadding" type="submit" value="Submit" />
                </form>
              </div> : null

            }
            {this.state.typechart === constClass.UPDATECOUNTCHART ? <div>
               
                <CanvasJSChart options={optionsUpdateCount} /> 
                </div>: null}



          </div>
        </Popup>









      </div>
    )
  }
}