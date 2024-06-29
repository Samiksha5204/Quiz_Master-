const controller=require("../controllers/customer.controller");
module.exports=function(app){
    app.post(
        "/getBySubjectId",
    controller.showdata
);
}