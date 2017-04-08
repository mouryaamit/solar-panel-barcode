angular.module('app.controllers', [])

.controller('entryCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
  $scope.data = null || {}
    $scope.scanBarcode = function () {
      cordova.plugins.barcodeScanner.scan(function(barcodeData)  {
        $scope.data.barcode = barcodeData.text.toString();
        // Success! Barcode data is here
      }, function(err)  {
        console.log(err)
        // An error occurred
      },{
        showTorchButton : true, // iOS and Android
        torchOn: false, // Android, launch with the torch switched on (if available)
        prompt : "Place a barcode inside the scan area", // Android
        formats : "CODE_128" // default: all but PDF_417 and RSS_EXPANDED
      })
    }

}])

.controller('testingCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('packagingCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
