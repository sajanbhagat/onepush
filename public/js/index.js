var onepushApp=angular.module('onepushApp',['angular-loading-bar','ui.bootstrap']);

onepushApp.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.latencyThreshold = 1
}]);

onepushApp.controller('parentController',function ($scope,$element,$http,$filter,$window) {

    $scope.data={};
    $scope.newWebsite={};

    $http({
        url:'https://hackerearth.0x10.info/api/one-push',
        method:'GET',
        params:{
            "type":"json",
            "query":"list_websites"
        }
    }).then(function successcallback(response) {
        if(response.status==200){
            $scope.website_list=response.data.websites;
            $scope.data.website_list=$filter('limitTo')($scope.website_list, 5, 0);
            $scope.data.website_count=$scope.website_list.length;
            $scope.data.currentPendingPage=1;

            $element.find('#autoComplete').autocomplete({
                lookup:$scope.website_list,
                lookupFilter:function (suggestion,query,queryLowerCase) {
                    if(suggestion.title.indexOf(query)!=-1 || suggestion.title.indexOf(queryLowerCase)!=-1){
                        suggestion.data=suggestion.title;
                        suggestion.value=suggestion.title;
                        return suggestion
                    }else if(suggestion.tag.indexOf(query)!=-1 || suggestion.tag.indexOf(queryLowerCase)!=-1) {
                        suggestion.data=suggestion.title;
                        suggestion.value=suggestion.title;
                        return suggestion
                    }else if(suggestion.url_address.indexOf(query)!=-1 || suggestion.url_address.indexOf(queryLowerCase)!=-1){
                        suggestion.data=suggestion.title;
                        suggestion.value=suggestion.title;
                        return suggestion
                    }else{
                        return
                    }
                },
                onSelect: function (suggestion) {
                    // console.log(suggestion)
                    $element.find('#autoComplete').val("");
                    $window.open(suggestion.url_address, '_blank');
                }
            });

        }else {
            $scope.website_list=[];
            $scope.data.website_list=[];
            $scope.data.website_count=0;
            $scope.data.currentPendingPage=1;
        }
    }, function errorCallback(err) {
        console.log(err);
    });

    $scope.increment=function (website) {
        if(website.likes){
            website.likes++;
        }else {
            website['likes']=1;
        }
        localStorage.setItem(website.id,website.likes)
    };

    $scope.likeCount=function (website) {
        var likesCount=localStorage.getItem(website.id);
        if(likesCount){
            website.likes = likesCount
        }else {
            website.likes = 0;
        }
    };

    $scope.getMoreWebsites=function () {
        $scope.data.website_list=$filter('limitTo')($scope.website_list, 5, (($scope.data.currentPendingPage-1)*5));
    };
    
    $scope.addWebsite=function () {
        var data=$scope.newWebsite;
        // data['type']='json';
        // data['query']='push';

        $http({
            url:'https://hackerearth.0x10.info/api/one-push?type=json&query=push',
            method:'GET',
            params:data
        }).then(function successCallback(response) {
            if(response.status==200&&response.data.status==403){
                swal("Error !",response.data.message,"error");
            }else if(response.status==200&&response.data.status==200) {
                swal("Success !",response.data.message,"success");
            }else {
                console.log(response.data);
            }
            $scope.newWebsite={};
        },function errorCallback(err) {
            console.log(err);
        })

    };


    /*
     {
        "status":"403",
        "message":"Wait for a  turn and push! Maintain a gap of 800 seconds between each hit.",
        "gap":1474113068
     }
     {
         "status":"200",
         "message":"Website added successfully",
         "gap":1474113068
     }
    */

});