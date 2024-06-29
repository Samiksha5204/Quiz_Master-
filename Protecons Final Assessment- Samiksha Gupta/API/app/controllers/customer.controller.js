const storeData=require("../module/storedata");
exports.showdata =async (request, response) => {  
    const subjectId = request?.body?.subject_id;
    try {          
        const result =await storeData.store(subjectId);
        response.json({ data: result, message: 'Data found' });
    } 
    catch (e) {
        response.json({ error: e });
    } 
};