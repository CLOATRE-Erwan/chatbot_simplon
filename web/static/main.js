
$(function() {


  async function predict_next_message(msg){
    model = await tf.loadLayersModel('static/model.json');
    const tensor = tf.tensor2d(msg,[1,10]);
    console.time('coucou')
    var preds = await model.predict(tensor);
    var data= await preds.dataSync()
    var item_id = await preds.argMax(-1).data()
    console.timeEnd('coucou')
    var item=dictionnaire_response[item_id]

    var url= 'http://127.0.0.1/response/'+item+'/'+person_type;
    var result=runApi(url)
    setTimeout(function() {  
      if (person=='student'){
        generate_message(result, 'user'); 
      }
      else if (person=='partner'){
        generate_message(result, 'user'); 
          }
      },500);

    
  };

  
  var dictionnaire_response={0: 'educationprogram', 1: 'financialhelp', 2: 'goodbye', 3: 'greetings', 4: 'inscription', 5: 'nature', 
  6: 'nextsession', 7: 'pcspecs', 8: 'pedagogy', 9: 'poleemploi', 10: 'potentialia', 11: 'prerequisite', 12: 'price', 13: 'software', 
  14: 'timetable', 15: 'validation', 16: 'whatisdevia', 17: 'whatisia', 18: 'whatismicrosoftia', 19: 'whatissimplon', 20: 'whyia'}

  var INDEX = 0; 
  var person="";
  var person_type='';
  $("#chat-submit").click(function(e) {
    e.preventDefault();
    var msg = $("#chat-input").val(); 
    if(msg.trim() == ''){
      return false;
    }
    result = runPyScript(msg);
    result= JSON.parse(result)
    console.log(result)
    predict_next_message(result)
    generate_message(msg, 'self');
    var buttons = [
        {
          name: 'Existing User',
          value: 'existing'
        },
        {
          name: 'New User',
          value: 'new'
        }
      ];
    var proceessed_question = strNoAccent(msg).toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
    console.log(proceessed_question)
    setTimeout(function() {  
      if (person==""){
        if (strNoAccent(msg).toLowerCase()=='etudiant'){
          generate_message("Bienvenue jeune padawan", 'user');  
          setTimeout(function() {     
            generate_message("Je suis ici pour vous guider afin de découvrir notre offre de formation. Que souhaiteriez vous savoir ?", 'user');
          }, 1000)
          person="student"
          person_type='responses_learner'

          
        }
        else if (strNoAccent(msg).toLowerCase()=='partenaire'){
          person="partner"
          person_type='responses_business'
          generate_message("Bienvenue. ", 'user');  
          setTimeout(function() {     
            generate_message("Merci de vous interresser à notre offre de formation. Que souhaiteriez vous savoir ?", 'user');
          }, 1000)
        }
        else {
          generate_message("Je n'ai pas compris votre réponse. Veuillez répondre par 'Partenaire' ou  'Etudiant' svp.", 'user'); 
        }
      }
    }, 1000)
    
  })
  
  function generate_message(msg, type) {
    INDEX++;
    var str="";
    str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg "+type+"\">";
    str += "          <span class=\"msg-avatar\">";
    str += "          <\/span>";
    str += "          <div class=\"cm-msg-text\">";
    str += msg;
    str += "          <\/div>";
    str += "        <\/div>";
    $(".chat-logs").append(str);
    $("#cm-msg-"+INDEX).hide().fadeIn(300);
    if(type == 'self'){
     $("#chat-input").val(''); 
    }    
    $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);    
  }  
  
  function generate_button_message(msg, buttons){    
    /* Buttons should be object array 
      [
        {
          name: 'Existing User',
          value: 'existing'
        },
        {
          name: 'New User',
          value: 'new'
        }
      ]
    */
    INDEX++;
    var btn_obj = buttons.map(function(button) {
       return  "              <li class=\"button\"><a href=\"javascript:;\" class=\"btn btn-primary chat-btn\" chat-value=\""+button.value+"\">"+button.name+"<\/a><\/li>";
    }).join('');
    var str="";
    str += "<div id='cm-msg-"+INDEX+"' class=\"chat-msg user\">";
    str += "          <span class=\"msg-avatar\">";
    str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
    str += "          <\/span>";
    str += "          <div class=\"cm-msg-text\">";
    str += msg;
    str += "          <\/div>";
    str += "          <div class=\"cm-msg-button\">";
    str += "            <ul>";   
    str += btn_obj;
    str += "            <\/ul>";
    str += "          <\/div>";
    str += "        <\/div>";
    $(".chat-logs").append(str);
    $("#cm-msg-"+INDEX).hide().fadeIn(300);   
    $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);
    $("#chat-input").attr("disabled", true);
  }
  
  $(document).delegate(".chat-btn", "click", function() {
    var value = $(this).attr("chat-value");
    var name = $(this).html();
    $("#chat-input").attr("disabled", false);
    generate_message(name, 'self');
  })
  
  $("#chat-circle").click(function() {    
    $("#chat-circle").toggle('scale');
    $(".chat-box").toggle('scale');
    setTimeout(function() {     
      generate_message("Bonjour", 'user');
    }, 500)
    setTimeout(function() {     
      generate_message("Je suis le bot de Simplon et je suis ici pour vous guider.", 'user');
    }, 1500)
    setTimeout(function() {     
      generate_message("Avant toute choses, souhaitez-vous devenir étudiant ou partenaire ?", 'user');
    }, 2500)

  })
  
  $(".chat-box-toggle").click(function() {
    $("#chat-circle").toggle('scale');
    $(".chat-box").toggle('scale');
  })

  function strNoAccent(a) {
    var b="áàâäãåçéèêëíïîìñóòôöõúùûüýÁÀÂÄÃÅÇÉÈÊËÍÏÎÌÑÓÒÔÖÕÚÙÛÜÝ",
        c="aaaaaaceeeeiiiinooooouuuuyAAAAAACEEEEIIIINOOOOOUUUUY",
        d="";
    for(var i = 0, j = a.length; i < j; i++) {
      var e = a.substr(i, 1);
      d += (b.indexOf(e) !== -1) ? c.substr(b.indexOf(e), 1) : e;
    }
    return d;
  }

  function runPyScript(input){
    var jqXHR = $.ajax({
        type: "POST",
        url: "/login",
        async: false,
        data: { mydata: input }
    });
    return jqXHR.responseText;


}
function runApi(input){
  var jqXHR = $.ajax({
      type: "POST",
      url: "/api",
      async: false,
      data: { mydata: input }
  });
  return jqXHR.responseText;


}

  

})

