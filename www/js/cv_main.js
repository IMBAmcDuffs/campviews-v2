// Main JS Include - Version 0.0.1

var cv = {
	current: {
		camps: {},
		user: {},	
	},
	dataTypes: {
		camps: {
			id: '',
			campname: '',
			dateStart: '',
			dateEnd: '',
			imageUrl: ''	
		},
		user: {
			id: '',
			username: '',
			handshake: ''
		}
	},
	init: function() {
		
	},
	loadDataTypes: function(tx, results) {
        cache.dataTypes = [];
        cache.dataTypeUrls = [];
        cache.dataIndex = 0;
        cache.apiIndex = 1;
        var len = results.rows.length;
        for(var i=0; i< len; i++) {
            cache.dataTypeUrls.push(results.rows.item(i).url);
            cache.dataTypes.push(results.rows.item(i).type);
        }
        swapi.loadDataType();
    },
    loadDataType: function() {
        if(cache.dataIndex < cache.dataTypeUrls.length) {
            cache.tempData = [];
            swapi.ajaxGet(
                cache.dataTypeUrls[cache.dataIndex],
                {},
                swapi.processData
            );
        }
        else {
            dataStore.set('hasData', 'true');
            global.rootScope.$apply(function() {
                global.location.path('/dashboard');
                global.loading.hide();
            });
        }

    },
    processData: function(data) {
        var newWidth = (cache.apiIndex * 2.5) + '%';
        $('#apiprogess').css({width: newWidth});
        cache.apiIndex++;
        cache.tempData = cache.tempData.concat(data.results);
        if(data.next) {
            swapi.ajaxGet(
                data.next,
                {},
                swapi.processData
            );
        }
        else {
            appdb.loadData();
        }
    },
    buildData: {
        dataTypes: function (tx, results) {

        }
    },
    ajaxGet: function(methodName, data, successCallback, errorCallback) {
        $.ajax({
            url: methodName,
            data: data,
            cache: false,
            type: 'GET',
            success: function(result, status, xhr) {
                if ($.isFunction(successCallback)) {
                    successCallback(result);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if ($.isFunction(errorCallback)) {
                    errorCallback();
                }
                else {
                    console.log('crap didnt work!');
                }
            }
        });
    }
};