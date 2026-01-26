const source = "http://127.0.0.1:5000/api/"

async function apiRequest(request = "", method, params, data) {
    var url = source + request;
    if(params != undefined)
    {
        Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
    }
    console.log(url);
    const response = await fetch(url, {
        method: method
    });
    const myJson = await response.json();
    console.log(myJson);
    if(!myJson.SUCCESS)
    {
        throw new Error(myJson);
    }
    return myJson.CONTENT;
}