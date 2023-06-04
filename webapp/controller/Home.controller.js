sap.ui.define(
  ["sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/m/Dialog",
  "sap/ui/model/json/JSONModel",
  "sap/m/Button"],
  /**
   
@param {typeof sap.ui.core.mvc.Controller} Controller*/
function (Controller, Fragment, Dialog, JSONModel, Button) {"use strict";

    return Controller.extend("testapp.controller.Home", {
      onInit: async function () {
        this.getView().setBusy(true);

        var oModel = new sap.ui.model.json.JSONModel();
        var sData = {};
        oModel.setData(sData);
        this.getView().setModel(oModel, "modelloDati");

        var oCustomer = new sap.ui.model.json.JSONModel();
        var aCustomer = await this._getHanaData("/Customers");
        oCustomer.setData(aCustomer);
        this.getView().setModel(oCustomer, "Customers");

        var oEmployees = new sap.ui.model.json.JSONModel();
        var aEmployees = await this._getHanaData("/Employees");
        oEmployees.setData(aEmployees);
        this.getView().setModel(oEmployees, "Employees");

        this.getView().setBusy(false);
      },
      _getDbPromised: function (entity, property) {
        let model = this.getOwnerComponent().getModel();
        return new Promise((resolve, reject) => {
          model.read(entity, {
            success: (odata) => {
              let sProp = property;
              resolve({
                [sProp]: odata.results,
              });
            },
            error: (error) => {
              reject(error);
            },
          });
        });
      },
      _getHanaData: function (Entity) {
        var xsoDataModelReport = this.getOwnerComponent().getModel();
        return new Promise(function (resolve, reject) {
          xsoDataModelReport.read(Entity, {
            success: function (oDataIn, oResponse) {
              resolve(oDataIn.results);
            },
            error: function (error) {
              console.log(error)
              reject(console.log("error calling hana DB"));
            },
          });
        });
      },
      onAdd: function () {
        if (!this.pDialog) {
          this.pDialog = this.loadFragment({
              name: "testapp.view.Fragments.form"
          });
      } 
      this.pDialog.then(function(oDialog) {
          oDialog.open();
      });
      },
      addEmployee: function (oEvent) {
        let oForm = this.getView().getModel("formModel").getData();
        console.log(oForm);
        
        var aTable = structuredClone(
          this.getView().getModel("Employees").getData()
        );
        aTable.push(oForm);
        this.getView()
          .getModel("Employees")
          .setData(aTable);

          console.log(aTable);
          this.closeOnPress();
      },
      closeOnPress: function(oEvent){
        var oDialog = this.getView().byId("helloDialog");
        oDialog.close();

    },
    onModify: function (oEvent) {
      let oSource = oEvent.getSource();
      console.log(oSource);
      let mod = oSource.getBindingContext("Employees").getObject();
      console.log(mod);
      this.getView().setModel(new JSONModel(mod),"riga")

      let oForm = new sap.ui.layout.form.SimpleForm({
        layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
        editable:true 
        });
    oForm.addContent(new sap.m.Label({
            text: "Last Name"
            }));
     oForm.addContent(new sap.m.Input({
            value: "{riga>/LastName}"
            }));
    oForm.addContent(new sap.m.Label({
            text: "First Name"
            }));
    oForm.addContent(new sap.m.Input({
            value: "{riga>/FirstName}"
            }));
    oForm.addContent(new sap.m.Label({
            text: "Title"
            }));
    oForm.addContent(new sap.m.Input({
            value: "{riga>/Title}"
            }));
            
    if (!this.oDialog) {  
          this.oDialog = new Dialog({   
                 
          beginButton: new Button({
            text: "Modify",
            press: function (oEvent) {
            var oRiga =  this.getView().getModel("riga").getData()
                console.log(oRiga)
            var aTable = structuredClone(this.getView().getModel("Employees").getData())
                console.log(aTable)
              this.getView().getModel("Employees").setData(aTable)
              this.oDialog.close();
                          
              }.bind(this)
              }),
                  
                  endButton: new Button({
                      text: "Close",
                      press: function () {
                          this.oDialog.close();
                      }.bind(this)
                  })
              });

              this.getView().addDependent(this.oDialog);
              
          }
          this.oDialog.destroyContent();
          this.oDialog.addContent(oForm)
          this.oDialog.open();
      },
      onDelete: function (oEvent) {
        console.log("tua mamma")
        let oSource = oEvent.getSource();
      let mod = oSource.getBindingContext("Employees").getObject();
      let aTable = this.getView().getModel("Employees").getData();
      let filteredTable = aTable.filter(function (del) {
        return del !== mod;
      });
      this.getView().getModel("Employees").setData(filteredTable);
      console.log(`ho elimitato l'id: ${mod.EmployeeID}`);
      }
  });
  }
);
