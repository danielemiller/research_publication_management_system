class Sheet{
  constructor(sheetName, ssParent = SpreadsheetApp.getActiveSpreadsheet()){
    this.beginTime = new Date();
    if(typeof(sheetName) == "string"){
      this.sheetObject = ssParent.getSheetByName(sheetName);
    }else{
      this.sheetObject = sheetName;
    }
    Logger.log("sheetObject created in " + ((new Date().getTime() - this.beginTime.getTime())/1000) + "secs");
    this.dataArray = Sheets.Spreadsheets.Values.batchGet(ssParent.getId(), {ranges : this.sheetObject.getName()}).valueRanges[0].values;
    this.colObject = this.mkColObject();
    Logger.log("colObject created in " + ((new Date().getTime() - this.beginTime.getTime())/1000) + "secs");
    this.size = this.lastRowFinder();
    Logger.log("size created in " + ((new Date().getTime() - this.beginTime.getTime())/1000) + "secs");
    this.amtCols = this.sheetObject.getLastColumn();
    Logger.log("amtCols created in " + ((new Date().getTime() - this.beginTime.getTime())/1000) + "secs");
  }

  mkColObject () {
    // limit is the col inclusive to stop on if index started at 1 not 0.
    // assums that no headers repeat
    // creates a bijection of Col Names to Col Index on a sheet. Returns an object.
    var result = {}
    var keys = this.sheetObject.getRange(1,1,1,this.sheetObject.getLastColumn())
      .getValues();
    keys = keys[0];
    let i = 0;
    while(i<keys.length){
      result[keys[i]] = {};
      result[keys[i]]["ColIndex"] = i;
      if(keys[i].toUpperCase().indexOf("TIME") === -1 && keys[i].toUpperCase().indexOf("DATE") === -1){
        result["DateCol"] = false;
      }else{
        result["DateCol"] = true;
      }
      i += 1;
    }
    return result;
  }
  
  mkRow(cols,row){
    // Logger.log(colMap)
    // Logger.log(cols)
    // Logger.log(index)
    var newRow = []
    
    for(let col of cols){
      // Logger.log(col);
      let current = this.dataArray[row][this.colObject[col]["ColIndex"]];
      // if(this.colObject[col]["DateCol"]){
      //   current = Utilities.formatDate(current,"America/New_York","MM/dd/yyyy HH:mm:ss");
      // }
      newRow.push(current);
      if(/icket/.test(col)){
        current = mkTicketHyperLink(current);
        if(curernt == null){
        // makes a ticket hyperlink so sups can easily get to ticket in ticket system
          newRow.push("No Link");
        }else{
          newRow.push(mkTicketHyperLink(current));
        }
      }
    }
    return newRow;
  }

  findByIdentifier(searchItem, searchCol, findCol){
  // based on identifier find item in another column
  if(typeof(searchItem) == 'string'){
    searchItem = searchItem.toUpperCase();
    // Logger.log("searchItem is string. Upper case is "+ searchItem);
    for(let i=1;i<this.size;i++){
      // Logger.log("current is " + this.dataArray[i][this.colObject[searchCol]].toUpperCase());
      if(searchItem === this.dataArray[i][this.colObject[searchCol]["ColIndex"]].toUpperCase()){
        Logger.log("Found at row " + (i+1) + ". returning = " + this.dataArray[i][this.colObject[findCol]["ColIndex"]])
        return this.dataArray[i][this.colObject[findCol]["ColIndex"]];
      }
    }
  }
  for(let i=1;i<this.size;i++){
    if(searchItem == this.dataArray[i][this.colObject[searchCol]["ColIndex"]]){
      return this.dataArray[i][this.colObject[findCol]["ColIndex"]];
    }
  }
  Logger.log("searchItem was not found. searchItem = " + searchItem);
  return false;
  }
  
  lastRowFinder(){
    /* if sheet does not have any blank rows then add newRow to sheet.lastRow()+1
    else add row to first blank row */
  
    var isNotBlank = (element) => element != "";
    Logger.log("length of data is " + (this.dataArray.length))
    // i iterates thru the back until a row has something that is not a blank string
    // this assumes that there are more rows with content than without
    for(let i=this.dataArray.length-1;i>=0;i--){
      if(this.dataArray[i].some(isNotBlank)){
        Logger.log("found a row that wasn't blank");
        Logger.log("returning " +(i+1)+" as last row.");
        return i+1;
      }
    }
    return this.dataArray.length;
  }

  getColIndex(colName){
    return this.colObject[colName]["ColIndex"];
  }

  insertRow(newRow,position=null){
    if(newRow.length != this.amtCols){
      Logger.log("unable to add row. Columns do not match")
      return false;
    }
    if(position==null){
      this.dataArray.push(newRow);
      this.size += 1;
      return true;
    }
    if(position > lastRow){
      return false;
    }
    if(position === lastRow){
      this.dataArray.push(newRow)
      this.size += 1;
      return true;
    }
    //position is not null
    if(position < 0){
      // position becomes compliment of size - 1
      position = this.size -1 - position
    }
    //position is not null or negative or greater then size

    //will work but don't need it for this project. finish when needed 
    
  }

  appendRow(newRow){
    if(newRow.length > this.amtCols){
      Logger.log("unable to add row. Columns do not match")
      return false;
    }
    if(newRow.length < this.amtCols){
      var difference = this.amtCols - newRow.length;
      for(let i=0;i<difference;i++){
        newRow.push("")
      }
    }
    this.dataArray.push(newRow);
    this.size += 1;
    return true;
  }

  setSheet(){
    this.sheetObject.getRange(1,1,this.size,this.amtCols).setValues(this.dataArray);
    return true;
  }

  getValue(row, col){
    if(col > this.amtCols){
      Logger.log("col is out of range")
      return false;
    }
    if(row >= this.size){
      Logger.log("input row is greater than size of dataArray")
      return false;
    }
    if(typeof(col) == "string"){
      col = this.colObject[col]["ColIndex"];
    }
    return this.dataArray[row][col];
  }

  setValue(value,row,col){
    if(typeof(col) == "string"){
      col = this.colObject[col]["ColIndex"];
    }
    if(col > this.amtCols){
      Logger.log("col is out of range. Col = " + col + ". Amount of Cols on sheet is " + this.amtCols);
      return false;
    }
    if(row >= this.size){
      Logger.log("input row is greater than size of dataArray");
      return false;
    }
    this.dataArray[row][col] = value;
    return true;
  
  }

  getRow(row){
    if(row >= this.size){
      Logger.log("input row is greater than size of dataArray");
      return false;
    }
    return this.dataArray[row];
  }

}