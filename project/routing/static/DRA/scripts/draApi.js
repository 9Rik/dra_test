define([
    "d3"
], 
function (  
    d3
){
    function request(method, path, data){
        return new Promise(function(resolve, reject){
            $.ajax({
                url:"http://localhost:1337"+path,
                headers:{
                    "Content-Type":"application/json"
                },
                data:JSON.stringify(data?data:{}),
                method:method,
                success:function(reply){
                    if (reply.response) resolve(reply.response);
                    else reject(reply);
                },
                error:function(reply){
                    reject(reply);
                }
            });
        })
    }
    return { 
        request:request
    }    
});