angular.module('app.controllers', [])

.controller('entryCtrl', ['$scope', '$stateParams','SolarFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,SolarFactory) {
  $scope.data = null || {}
  $scope.status = "New";
  $scope.scanBarcode = function () {
    $scope.data = null || {}
    $scope.status = "New";
    cordova.plugins.barcodeScanner.scan(function(barcodeData)  {
        $scope.data.barcode = barcodeData.text.toString();
        SolarFactory.status({barcode:$scope.data.barcode}).$promise.then(function(result) {
          $scope.status = result.responseData.status;
        });
        // Success! Barcode data is here
      }, function(err)  {
        console.log(err);
        alert("Not Able to read Barcode")
        // An error occurred
      },{
        showTorchButton : true, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
        prompt : "Place a barcode inside the scan area", // Android
        formats : "CODE_128", // default: all but PDF_417 and RSS_EXPANDED
        orientation : "landscape"
      })
    }
    $scope.startEntry = function () {
      SolarFactory.entry({step:"Start",barcode:$scope.data.barcode}).$promise.then(function(result) {
        $scope.status = "Start";
      });
    }
    $scope.completeEntry = function () {
      SolarFactory.entry({step:"Complete",barcode:$scope.data.barcode}).$promise.then(function(result) {
        $scope.status = "New";
        $scope.data = null || {}
      });
    }

}])

.controller('testingCtrl', ['$scope', '$stateParams',"SolarFactory" ,// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,SolarFactory) {
  $scope.data = null || {}
  $scope.data2 = null || {}
  $scope.scanBarcode = function () {
    cordova.plugins.barcodeScanner.scan(function(barcodeData)  {
      $scope.data.barcode = barcodeData.text.toString();
      SolarFactory.status({barcode:$scope.data.barcode}).$promise.then(function(result) {
        $scope.status = result.responseData.status;
      });
      // Success! Barcode data is here
    }, function(err)  {
      console.log(err);
      alert("Not Able to read Barcode")
      // An error occurred
    },{
      showTorchButton : true, // iOS and Android
      torchOn: false, // Android, launch with the torch switched on (if available)
      prompt : "Place a barcode inside the scan area", // Android
      formats : "CODE_128", // default: all but PDF_417 and RSS_EXPANDED
      orientation : "landscape"
    })
  }
  $scope.readData = function () {
    SolarFactory.readData({barcode:$scope.data.barcode}).$promise.then(function(result) {
      $scope.data2 = result.responseData.result
    });
  }
  // $scope.readData = function () {
  // }
}])

.controller('packagingCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
