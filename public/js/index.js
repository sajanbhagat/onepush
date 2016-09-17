var onepushApp=angular.module('onepushApp',['angular-loading-bar','ui.bootstrap']);

onepushApp.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.latencyThreshold = 1
}]);

onepushApp.controller('parentController',function ($scope,$element,$http,$filter) {

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
        }else {
            $scope.website_list=[];
            $scope.data.website_list=[];
            $scope.data.website_count=0;
            $scope.data.currentPendingPage=1;
        }
    }, function errorCallback(err) {
        console.log(err);
    })

    $scope.increment=function (website) {
        if(website.likes){
            website.likes++;
        }else {
            website['likes']=1;
        }
        localStorage.setItem(website.id,website.likes)
    }

    $scope.likeCount=function (website) {
        var likesCount=localStorage.getItem(website.id);
        if(likesCount){
            website.likes = likesCount
        }else {
            website.likes = 0;
        }
    }

    $scope.getMoreWebsites=function () {
        $scope.data.website_list=$filter('limitTo')($scope.website_list, 5, (($scope.data.currentPendingPage-1)*5));
    };
    
    $scope.addWebsite=function () {
        var data=$scope.newWebsite;
        data['type']='json';
        data['query']='push';

        $http({
            url:'https://hackerearth.0x10.info/api/one-push',
            method:'GET',
            params:data
        }).then(function successCallback(response) {
            if(response.status==200&&response.data.status==403){
                swal("Error !",response.data.message,"error");
            }else {
                console.log(response.data);
            }
            $scope.newWebsite={};
        },function errorCallback(err) {
            console.log(err);
        })

    }
    /*
     {
        "status":"403",
        "message":"Wait for a  turn and push! Maintain a gap of 800 seconds between each hit.",
        "gap":1474113068
     }
    */

});