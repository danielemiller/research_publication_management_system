function doGet() {
    const htmlServ = HtmlService.createTemplateFromFile('index');
    return htmlServ.evaluate()
}

function getAbstracts() {
   const abstracts = new Sheet("Abstracts");
   let data = abstracts.dataArray
   Logger.log(data)
   return data
     
}

function getManuscripts() {
   const manuscripts = new Sheet("Manuscripts");
   let data = manuscripts.dataArray
   Logger.log(data)
   return data
     
}

function getPresentations() {
   const presentations = new Sheet("Presentations");
   let data = presentations.dataArray
   Logger.log(data)
   return data
     
}

function getOther() {
   const other = new Sheet("Other");
   let data = other.dataArray
   Logger.log(data)
   return data
     
}

function getInProgress() {
   const inProgress = new Sheet("Projects Currently in Progress");
   let data = inProgress.dataArray
   Logger.log(data)
   return data
     
}

function getStudentProjects() {
   const studentProjects = new Sheet("Student Projects Currently in Progress");
   let data = studentProjects.dataArray
   Logger.log(data)
   return data
     
}

function getMisc() {
   const misc = new Sheet("Miscellaneous Projects");
   let data = misc.dataArray
   Logger.log(data)
   return data
     
}

