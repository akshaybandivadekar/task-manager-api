module.exports = function(formData){
    const object2 = {
        create(id, obj) {
            return new Promise((resolve, reject) => { resolve('Test case working!');});
        }
    }
    const object1 = {
        client(obj) {
            return {
                messages: object2
            };
        }
    }
    return object1;
};