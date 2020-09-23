////Dialog box

//  // Locate dialog
//  var dialog = document.querySelector('dialog');

//  // Register dialog (once per dialog)
//  dialogPolyfill.registerDialog(dialog);

//  // Register clicks
//  $(".dialog-open").click(function(e){
//    $("body").addClass("dialog-is-open");
//    dialog.showModal();
//    console.log("Dialog opened");
//  });

//  // Dialog closed using button
//  $(".dialog-close").click(function(e){
//    console.log("Dialog closed explictly");
//    dialog.close();
//  });
  
//  dialog.addEventListener('cancel', function() {
//    console.log('Dialog canceled');
//  });

//  dialog.addEventListener('close', function() {
//    $("body").removeClass("dialog-is-open");
//    // console.log('Dialog closed');
//  });

//$('a.nojump').click(function(e)
//{
    

//    // Cancel the default action
//    e.preventDefault();
//});

var dialogBoxes = document.querySelectorAll('.dialog-box');
for (var i = 0; i < dialogBoxes.length; i++) {

    var dialog = dialogBoxes[i].querySelector('dialog'), // the <dialog> element
        dialogOpen = dialogBoxes[i].querySelector('.dialog-open'),  // the open button
        dialogClose = dialogBoxes[i].querySelectorAll('.dialog-close'); // the close button

    dialogPolyfill.registerDialog(dialog);

    dialogOpen.addEventListener('click', function (e) {
        $("body").addClass("dialog-is-open");
        this.showModal();
        console.log("Dialog opened");
    }.bind(dialog));

    //btnOpen.addEventListener('click', function (e) {
    //    $("body").addClass("dialog-is-open");
    //    this.showModal();
    //    console.log("Dialog opened");
    //}.bind(dialog));
    //  $(".dialog-open").click(function(e){
    //    $("body").addClass("dialog-is-open");
    //    dialog.showModal();
    //    console.log("Dialog opened");
    //  });

    for (var j = 0; j < dialogClose.length; j++) {
        dialogClose[j].addEventListener('click', function (e) {
            console.log("Dialog closed explictly");
            this.close();
        }.bind(dialog));
    }

    //btnClose.addEventListener('click', function (e) {
    //    console.log("Dialog closed explictly");
    //    this.close();
    //}.bind(dialog));
    //  $(".dialog-close").click(function(e){
    //    console.log("Dialog closed explictly");
    //    dialog.close();
    //  });

    // because you bind 'dialog' to the function, 'this' will be the dialog.
    // (if you don't use bind, 'this' will be btnOpen instead)

    //  dialog.addEventListener('cancel', function() {
    //    console.log('Dialog canceled');
    //  });

      dialog.addEventListener('close', function(e) {
        $("body").removeClass("dialog-is-open");
         console.log('Dialog closed');
      });
}
$('a.nojump').click(function(e)
{
    // Cancel the default action
    e.preventDefault();
});
