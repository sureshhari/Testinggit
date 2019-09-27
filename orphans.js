 var orphans = {
	m_feature:"",
	hideTableColumns: new Array(),
	jsonDataCollection: null,
	viewName:"orphansView",
	m_srcEvent:"",
	jsonDataCollection:[],
     testdata:'',
     selectRadio:'',
     selectedPrimaryfeature:'',
     primaryFeaetureParent:'',
    secondaryFeatureParent:new Array(),
     primaryParentValue:'',
     primaryValue:'',
     defectIDValue:'',


    /* Init function  */
    init: function() {		
		var projectName = localStorage.getItem('projectName');
		ISE.getOrphanResults(projectName, "*", false, orphans._receivedOrphanResults);
		ISEUtils.initCollectionTables("orphansD","defects", orphans);
		ISEUtils.initCollectionTables("orphansT","testcase", orphans);
		ISEUtils.initCollectionTables("orphansDP","defects", orphans);
		ISEUtils.initCollectionTables("orphansTP","testcase", orphans);
		ISEUtils.initCollectionTables("TCAA","testcase", orphans);
        ISE.getFeatures(projectName, orphans._receivedFeatures);
		
		$(".details #markAsCreateBtn").on("click", function(e){
				var getTestCaseIds = orphans.getTestCaseIdsFromSelection()
				
				console.log("--TestArray--"+getTestCaseIds );
				console.log("defIdvalue"+orphans.defectIDValue);
				var jsonStrObj ={"tcMap" : "Mark as created" };
				var jsonString='{"requesttype":"updateObjectModel","collection":"defects","columnname":"defectid","columnvalue":"'+orphans.defectIDValue+'","object":'+JSON.stringify(jsonStrObj)+',"projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}';
				console.log("jsonstring data chanding defects---"+JSON.stringify(jsonStrObj))
				ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString,orphans._receivedOrphanResultsFlag);
				if(e){
				 e.stopPropagation();
				 e.stopImmediatePropagation();
				 e.preventDefault();
				 return false;
				}
		});
		
		$("#orphanTestcasePopup #testCaseSubmit").on("click", function(e){
		
				var getTestCaseIds = orphans.getTestCaseIdsFromSelection();
				var testcases = {
					testcases: []
				};
				var testArray= [];
				for(var i=0;i<getTestCaseIds.length;i=i+2){
					var eachobj = new Object;
					eachobj.test_case_id = getTestCaseIds[i] ;
					eachobj.status = 'C' ;
					eachobj.type = 'Algo' ;
					eachobj.reviewed = 'No' ;
					testArray.push(eachobj);
				}
				
				var jsonStrObj ={"testcases" :testArray};
				var jsonString='{"requesttype":"updateObjectModel","collection":"defects","columnname":"defectid","columnvalue":"'+orphans.defectIDValue+'","object":'+JSON.stringify(jsonStrObj)+',"projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}';
				console.log("jsonstring data chanding defects---"+JSON.stringify(jsonStrObj));
				ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString,orphans._receivedOrphanResultsFlag);
				 $("#largeorph").hide();
               setTimeout(function(){
			onHashChange();
			$(".modal-backdrop.fade.in").remove();
			},6000);
			if(e){
				 e.stopPropagation();
				 e.stopImmediatePropagation();
				 e.preventDefault();
				 return false;
			}	
		});
     },
	 
	 _receivedFeatures:function(data) {
            
            orphans.testdata=[];
            orphans.selectRadio=[];

           
                for(var index in data)
                {

                	 var parentNode=new Array();        	
                 
                  

                   //console.log("111"+data[index].children);

                    for(var i=0;i<data[index].children.length;i++){

                    	var grandChildNode=new Object();
                    	var str= escape(data[index].children[i]);
                    	var primaryParent = escape(data[index].text);
                    	grandChildNode.price1="<input type=radio id=primaryparent name=primary onclick=orphans.radioBtnValue(this) primaryParent="+primaryParent+" value="+str+">";

                        var childNode=new Object();
                    	childNode.text=data[index].children[i];
                    	childNode.data=grandChildNode;
						
                    	parentNode.push(childNode);                    	

                    	}
                        console.log(data[index].children);
                    	var parentData=new Object();
                    	var str= escape(data[index].text);
                    	var primaryParent = "null"
         
                    	parentData.price1="<input type=radio id=primaryparent name=primary onclick=orphans.radioBtnValue(this) primaryParent="+primaryParent+" value="+str+">";
                         
                    	orphans.testdata.push({

                    	"text":data[index].text,
                    	"data": parentData,                   	
                    	"children":parentNode

                    })

                }
             


     $("#tree_2").bind("loaded_grid.jstree",function(){
                $("span#xstatus").text("loaded");

        });

        $("#tree_2").jstree({

          plugins: ["themes","json","state","orphans","checkbox","button","grid","dnd"],
          core: {

            data: orphans.testdata
          },
          grid: {
            columns: [
              {width: 50, header: "",title:"_DATA_"},
              {cellClass: "col1", value: "price1", width: 60, header: "Primary Feature", title:""},
              
            ]
          },

          dnd: {
                    drop_finish : function () { 
                    }, 
                    drag_finish : function () { 
                    }, 
                    drag_check : function (data) { 
                        return { 
                            after : true, 
                            before : true, 
                            inside : true 
                        }; 
                    } 
          }
        });


 
        
	 },


      

	   

saveChanges:function(){

				var selectedElmsIds = [];
				var selectedElmsIdsParents = [];

				var selectedElms = $('#tree_2').jstree("get_selected", true);
				var arr =[];
               
				

               for(var index=0;index<selectedElms.length;index++){
               	selectedElmsIds.push(selectedElms[index].text);
               	var parentNode1 = document.getElementById(selectedElms[index].parent);
              
               	if(parentNode1 != null){

               		var id = document.getElementById(selectedElms[index].parent).getAttribute("id");

               		 	arr.push($('#'+id).find('a').attr('title'));

               	}

              
                
               }
               selectedElmsIds.splice(_.indexOf(selectedElmsIds, _.findWhere(selectedElmsIds,orphans.selectedPrimaryfeature )), 1);
              
                


                var finalSecondaryFeaturesList = [];
                $.grep(selectedElmsIds, function (element) {

				    if ($.inArray(element, arr) != -1) 
				    {}
				        
				        else
				        finalSecondaryFeaturesList.push(element)
				   

				});
                console.log("primary feature: "+orphans.primaryValue);
               console.log("Primary feature parent: "+orphans.primaryParentValue);
              
              arr.splice(_.indexOf(arr, _.findWhere(arr,orphans.primaryParentValue )), 1);
              
              var secondayFeatures = [];
              for(var i=0;i<finalSecondaryFeaturesList.length;i++){
              
              	var parentfea = arr[i];
              	if(arr[i] == undefined){
					parentfea = "N.A";
              	}
				console.log(finalSecondaryFeaturesList[i]+  "-$-"+parentfea)
				secondayFeatures.push(finalSecondaryFeaturesList[i]+  "-$-"+parentfea);

              }
              
              			   
			   console.log("--------collection Name189 orphan ----"+ISEUtils.colectionName);
			    var collectionNameT;
			   if(ISEUtils.colectionName == "Defects"){
					collectionNameT = "defects";
				}
				else if(ISEUtils.colectionName == "TestCase"){
					collectionNameT = "testcases";
				}
				else {
					collectionNameT = "source";
				}
			   
			   
				console.log("---orphan before saving collection Name ----"+collectionNameT);
               for (var i=0;i<ISEUtils.defectIdcount.length;i++)
					{
					console.log("---orphans mapping data values 205---"+ISEUtils.defectIdcount[i]);
						var secondFeatFormation = [];
						
						for (var j=0;j<secondayFeatures.length;j++)
						{
							var secondFeaSplit = secondayFeatures[j].split("-$-");
							var secondFea = {};
							secondFea = { "feature" : secondFeaSplit[0] , "featureParent" : secondFeaSplit[1] , "frequency" : "0.0"} ;
							secondFeatFormation.push(secondFea);
						}
						
					
						var primaryParentData = (orphans.primaryParentValue == "null")?"N.A":orphans.primaryParentValue
						if(orphans.primaryValue == "") {
						console.log("parent feature not selected, Thus data not saved in database");
						alert("please select primary feature radio button");						
						return;
						}
						var jsonStrObj ={ "primary_feature" : orphans.primaryValue , "primary_feature_parent" : primaryParentData , "secondary_feature" : { "featureList" : secondFeatFormation} , "mapped" : "manuallymapped"};
						var jsonString='{"requesttype":"updateObjectModel","collection":"'+collectionNameT+'","columnname":"defectid","columnvalue":"'+ISEUtils.defectIdcount[i]+'","object":'+JSON.stringify(jsonStrObj)+',"projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}';
						 console.log("jsonstring data chanding defects---"+JSON.stringify(jsonStrObj))
						ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString,orphans._receivedOrphanResultsFlag);
					
					
				}
				
				$('#tree_2').jstree(true).deselect_all();
			   refresh=true;
			  $("#tree_2").jstree("refresh");
			  $("#tree_2").jstree("deselect_all");
			  $('input[name="primary"]').attr('checked', false);
			  $('#largefeature').modal('hide');
			   $('#large1').modal('hide');	
				
							
               setTimeout(function(){
				onHashChange();	
				$(".modal-backdrop.fade.in").remove();
			},6000);
				
	},

		_receivedOrphanResultsFlag:function(data){
			console.log("result---"+JSON.stringify(data));
			//orphans.init();
		
		},
	 	  
	_receivedOrphanResults:function(data){
		if(null !=data && undefined != data && data.length>0){
			for (var i=0;i<data.length;i++)
			{
				orphans.addOrphanBucket(data[i], false);
				orphans._addTableRowOrphanResults(data[i]);
			}


          $('#sample_2_filter').addClass("hide");
           $('#sample_2_wrapper').addClass("hide");
          


		}
	},
	  
	addOrphanBucket:function(eachFeature,isPopup) {
		var bucket = {
			prtltCol : $("<div>", {class: "col-md-3"}),
			prtltConatiner : $("<div>", {class: "portlet green-meadow box"}),
			prtltTitle : $("<div>", {class: "portlet-title"}),
			prtltCaption : $("<div>", {class: "caption", title:eachFeature.name, text:orphans.trimText(eachFeature.name,20)}),
			prtltIcon : $("<i>", {class: "fa fa-gift"}),
			prtltTools : $("<div>", {class: "tools"}),
			prtltCollapse : $("<a>", {class: "collapse", href:"javascript:;"}),
			prtltBody : $("<div>", {class: "portlet-body"}),
			
			
			prtltPopupTC : $("<a>", {"data-toggle":"modal", onclick:"javascript:orphans.renderPopup('"+eachFeature.name+"','TC',this,event);", href:"#largeorph"}),
			prtltPopupID : $("<a>", {"data-toggle":"modal", onclick:"javascript:orphans.renderPopup('"+eachFeature.name+"','ID',this,event);", href:"#largeorph"}),
			prtltPopupIDO : $("<a>", {"data-toggle":"modal", onclick:"javascript:orphans.renderPopup('"+eachFeature.name+"','IDO',this,event);", href:"#largeorph"}),
			prtltPopupED : $("<a>", {"data-toggle":"modal", onclick:"javascript:orphans.renderPopup('"+eachFeature.name+"','ED',this,event);", href:"#largeorph"}),
			prtltPopupEDO : $("<a>", {"data-toggle":"modal", onclick:"javascript:orphans.renderPopup('"+eachFeature.name+"','EDO',this,event);", href:"#largeorph"}),
			
			prtltPopupTCP : $("<a>", {"data-toggle":"modal", onclick:"javascript:orphans.renderPopupP('"+eachFeature.name+"','TC',this,event);", href:"#largeorphP"}),
			prtltPopupIDP : $("<a>", {"data-toggle":"modal", onclick:"javascript:orphans.renderPopupP('"+eachFeature.name+"','ID',this,event);", href:"#largeorphP"}),
			prtltPopupIDOP : $("<a>", {"data-toggle":"modal", onclick:"javascript:orphans.renderPopupP('"+eachFeature.name+"','IDO',this,event);", href:"#largeorphP"}),
			prtltPopupEDP : $("<a>", {"data-toggle":"modal", onclick:"javascript:orphans.renderPopupP('"+eachFeature.name+"','ED',this,event);", href:"#largeorphP"}),
			prtltPopupEDOP : $("<a>", {"data-toggle":"modal", onclick:"javascript:orphans.renderPopupP('"+eachFeature.name+"','EDO',this,event);", href:"#largeorphP"}),
			
			prtltTable : $("<div>", {class: "row static-info"}),
			prtltTCN : $("<div>", {class: "col-md-7 name", title:"Number of Testcases Executed",text:"Testcase Count:"}),
			prtltTCV : $("<div>", {class: "col-md-5 value", text:eachFeature.tcCount, id:"TC_"+eachFeature.name}),
			prtltIntDefN : $("<div>", {class: "col-md-7 name", title:"Defects identified by testing team, which are having testcases",text:"Internal Defects:"}),
			prtltIntDefV : $("<div>", {class: "col-md-5 value", text:eachFeature.intDefCount, id:"IntDef_"+eachFeature.name}),
			prtltIntOrphN : $("<div>", {class: "col-md-7 name", title:"Defects identified by testing team, which doesn't have testcases",text:"Internal Orphans:"}),
			prtltIntOrphV : $("<div>", {class: "col-md-5 value", text:eachFeature.intOrphDefCount, id:"IntOrph_"+eachFeature.name}),
			prtltExtDefN : $("<div>", {class: "col-md-7 name", title:"Defects reported by customer, which are having testcases",text:"CRDs:"}),
			prtltExtDefV : $("<div>", {class: "col-md-5 value", text:eachFeature.extDefCount, id:"ExtDef_"+eachFeature.name}),
			prtltExtOrphN : $("<div>", {class: "col-md-7 name", title:"Defects reported by customer, which doesn't have testcases",text:"CRD Orphans"}),
			prtltExtOrphV : $("<div>", {class: "col-md-5 value", text:eachFeature.extOrphDefCount, id:"ExtOrph_"+eachFeature.name}),
		};

		bucket.prtltTitle.appendTo(bucket.prtltConatiner);
		bucket.prtltCaption.appendTo(bucket.prtltTitle);
		bucket.prtltIcon.appendTo(bucket.prtltCaption);
		bucket.prtltTools.appendTo(bucket.prtltTitle);
		bucket.prtltCollapse.appendTo(bucket.prtltTools);

		bucket.prtltTCN.appendTo(bucket.prtltTable);
		if(!isPopup) {
			bucket.prtltTCV.appendTo(bucket.prtltPopupTC);
			bucket.prtltPopupTC.appendTo(bucket.prtltTable);
		}
		else {
			bucket.prtltTCV.appendTo(bucket.prtltPopupTCP);
			bucket.prtltPopupTCP.appendTo(bucket.prtltTable);
		}

		bucket.prtltIntDefN.appendTo(bucket.prtltTable);
		if(!isPopup) {
			bucket.prtltIntDefV.appendTo(bucket.prtltPopupID);
			bucket.prtltPopupID.appendTo(bucket.prtltTable);
		}
		else {
			bucket.prtltIntDefV.appendTo(bucket.prtltPopupIDP);
			bucket.prtltPopupIDP.appendTo(bucket.prtltTable);
		}
		
		bucket.prtltIntOrphN.appendTo(bucket.prtltTable);		
		if(!isPopup) {
			bucket.prtltIntOrphV.appendTo(bucket.prtltPopupIDO);
			bucket.prtltPopupIDO.appendTo(bucket.prtltTable);		
		}
		else {
			bucket.prtltIntOrphV.appendTo(bucket.prtltPopupIDOP);
			bucket.prtltPopupIDOP.appendTo(bucket.prtltTable);		
		}
		
		bucket.prtltExtDefN.appendTo(bucket.prtltTable);
		if(!isPopup) {
			bucket.prtltExtDefV.appendTo(bucket.prtltPopupED);
			bucket.prtltPopupED.appendTo(bucket.prtltTable);
		}
		else {
			bucket.prtltExtDefV.appendTo(bucket.prtltPopupEDP);
			bucket.prtltPopupEDP.appendTo(bucket.prtltTable);
		}

		bucket.prtltExtOrphN.appendTo(bucket.prtltTable);
		if(!isPopup) {
			bucket.prtltExtOrphV.appendTo(bucket.prtltPopupEDO);
			bucket.prtltPopupEDO.appendTo(bucket.prtltTable);
		}
		else {
			bucket.prtltExtOrphV.appendTo(bucket.prtltPopupEDOP);
			bucket.prtltPopupEDOP.appendTo(bucket.prtltTable);
		}
		
		bucket.prtltTable.appendTo(bucket.prtltBody);

		bucket.prtltBody.appendTo(bucket.prtltConatiner);
		bucket.prtltConatiner.appendTo(bucket.prtltCol);
		if(isPopup){


		  if($('#orphan_Buckets').is(":visible")) {
		  	$('#sample_21_wrapper').addClass("hide");
			$("#largeorph > div > div > div.modal-footer #btn_change").hide()
			bucket.prtltCol.appendTo("#orphan_BucketsPopup");
			
		}
		else
		{

		
  
			var tableRow ="<tr>"
         tableRow+="<td>"+eachFeature.name+"</td>";

         if(eachFeature.tcCount!=0)
         tableRow+="<td><a data-toggle='modal' onclick=orphans.renderPopupP('"+escape(eachFeature.name)+"','TC',this,event); href=#largeorphP>"+eachFeature.tcCount+"</a></td>";
         else
         tableRow+="<td style=color:#7dc1eb >"+eachFeature.tcCount+"</td>";

         if(eachFeature.intDefCount!=0)
         tableRow+="<td><a data-toggle='modal' onclick=orphans.renderPopupP('"+escape(eachFeature.name)+"','ID',this,event); href=#largeorphP>"+eachFeature.intDefCount+"</a></td>";
         else
         tableRow+="<td style=color:#7dc1eb >"+eachFeature.intDefCount+"</td>";

         if(eachFeature.intOrphDefCount!=0)
         tableRow+="<td><a data-toggle='modal' onclick=orphans.renderPopupP('"+escape(eachFeature.name)+"','IDO',this,event); href=#largeorphP>"+eachFeature.intOrphDefCount+"</a></td>";
         else
         tableRow+="<td style=color:#7dc1eb >"+eachFeature.intOrphDefCount+"</td>";

         if(eachFeature.extDefCount!=0)
         tableRow+="<td><a data-toggle='modal' onclick=orphans.renderPopupP('"+escape(eachFeature.name)+"','ED',this,event); href=#largeorphP>"+eachFeature.extDefCount+"</a></td>";
         else
         tableRow+="<td style=color:#7dc1eb >"+eachFeature.extDefCount+"</td>";

         if(eachFeature.extOrphDefCount!=0)
         tableRow+="<td><a data-toggle='modal' onclick=orphans.renderPopupP('"+escape(eachFeature.name)+"','EDO',this,event); href=#largeorphP>"+eachFeature.extOrphDefCount+"</a></td>";
         else
         tableRow+="<td style=color:#7dc1eb >"+eachFeature.extOrphDefCount+"</td>";

			$('#orphanPopupTablebody').append(tableRow);
			$('#sample_21_wrapper').removeClass("hide");
			$('#btn_change').hide();

			
		}

		}		
	
		else
			bucket.prtltCol.appendTo("#orphan_Buckets");
	},

    

	_addTableRowOrphanResults:function(eachFeature){

    var tableRow ="<tr>"
         tableRow+="<td>"+eachFeature.name+"</td>";
         var featureValue = escape(eachFeature.name);
         if(eachFeature.tcCount!=0)
         tableRow+="<td><a data-toggle='modal' onclick=orphans.renderPopup('"+featureValue+"','TC',this,event); href=#largeorph >"+eachFeature.tcCount+"</a></td>";
         else
         tableRow+="<td style=color:#7dc1eb >"+eachFeature.tcCount+"</td>";

         if(eachFeature.intDefCount!=0)
         tableRow+="<td><a data-toggle='modal' onclick=orphans.renderPopup('"+featureValue+"','ID',this,event); href=#largeorph >"+eachFeature.intDefCount+"</a></td>";
         else
         tableRow+="<td style=color:#7dc1eb >"+eachFeature.intDefCount+"</td>";

         if(eachFeature.intOrphDefCount!=0)
         tableRow+="<td><a data-toggle='modal' onclick=orphans.renderPopup('"+featureValue+"','IDO',this,event); href=#largeorph >"+eachFeature.intOrphDefCount+"</a></td>";
         else
         tableRow+="<td style=color:#7dc1eb >"+eachFeature.intOrphDefCount+"</td>";

         if(eachFeature.extDefCount!=0)
         tableRow+="<td><a data-toggle='modal' onclick=orphans.renderPopup('"+featureValue+"','ED',this,event); href=#largeorph >"+eachFeature.extDefCount+"</a></td>";
         else
         tableRow+="<td style=color:#7dc1eb >"+eachFeature.extDefCount+"</td>";

         if(eachFeature.extOrphDefCount!=0)
         tableRow+="<td style=color:#7dc1eb ><a data-toggle='modal' onclick=orphans.renderPopup('"+featureValue+"','EDO',this,event); href=#largeorph >"+eachFeature.extOrphDefCount+"</a></td>";
         else
         tableRow+="<td>"+eachFeature.extOrphDefCount+"</td>";
         

       $("#orphanTablebody").append(tableRow);


  },




	trimText:function(text, len) {
		if(text.length < 25)
			return text;
		else
			return text.substring(0,len)+"...";
	},


	switchView:function() {
		if($('#orphan_Buckets').is(":visible")) {
			$('#orphan_Buckets').hide();
			 $('#sample_2_wrapper').removeClass("hide");
			$('#orphan_Table').show();
		}
		else {
			onHashChange();//for switch view it is required
			$('#orphan_Buckets').show();
			$('#orphan_Table').hide();
			 $('#sample_2_wrapper').addClass("hide");
		}
	},
	
	renderPopup:function(feature,srcEvent,e,event) {
		if(parseInt($(e).children("div.col-md-5").text())<1){
			event.stopPropagation();
			event.preventDefault();
			return false;
		}
		orphans.m_srcEvent=srcEvent;
		$('#orphan_BucketsPopup').empty();
		$('#searchResultsTable_orphansD').hide();
		$('#searchResultsTable_orphansT').hide();
			
		var projectName = localStorage.getItem('projectName');
		if (feature == "Others")
			var filter = "_missing_:primary_feature.keyword OR primary_feature.keyword:\"\"";
		else
			var filter = 'primary_feature_parent.keyword:"'+unescape(feature)+'" primary_feature.keyword:"'+unescape(feature)+'"';
		orphans.m_feature = unescape(feature);
		ISE.getOrphanResults(projectName, filter, true, orphans._receivedOrphanResultsPopup);
		ISEUtils.defectIdcount=[];
		ISEUtils.tableData = [];
	},
	
	_receivedOrphanResultsPopup:function(data){
		if(null !=data && undefined != data && data.length>0){
			for (var i=0;i<data.length;i++)
				orphans.addOrphanBucket(data[i], true);
		}
		else {
		
			if (orphans.m_feature == "Others")
				var filter = "(_missing_:primary_feature.keyword OR primary_feature.keyword:\"\")";
			else
				var filter = 'primary_feature_parent.keyword:"'+orphans.m_feature+'" primary_feature.keyword:"'+orphans.m_feature+'"';
		
			if(orphans.m_srcEvent == "ID")
				filter = filter +'  AND internaldefect: \"1\" AND _exists_:testcases';
			if(orphans.m_srcEvent == "IDO"){
				filter = filter +'  AND internaldefect: \"1\" ';
				var requestObject = new Object();
                requestObject.title = "";
                requestObject.searchString = filter.replace(/\//g, " ");				
                requestObject.filterString = "";
                requestObject.projectName = localStorage.getItem('projectName');;
                requestObject.maxResults = 10000; 
                requestObject.serachType = "";				
				requestObject.collectionName = "defects";
				ISE.getinternalorphans(requestObject, orphans._receivedSearchResults);
				
				return;
			}
			if(orphans.m_srcEvent == "ED")
				filter = filter +'  AND internaldefect: \"0\" AND _exists_:testcases';
			if(orphans.m_srcEvent == "EDO"){
				filter = filter +'  AND internaldefect: \"0\" ';
				var requestObject = new Object();
                requestObject.title = "";
                requestObject.searchString = filter.replace(/\//g, " ");				
                requestObject.filterString = "";
                requestObject.projectName = localStorage.getItem('projectName');;
                requestObject.maxResults = 10000; 
                requestObject.serachType = "";				
				requestObject.collectionName = "defects";
				ISE.getinternalorphans(requestObject, orphans._receivedSearchResults);
				
				return;
			}
				
			var requestObject = new Object();

                requestObject.title = "";
                requestObject.searchString = filter.replace(/\//g, " ");
				
                requestObject.filterString = "";
                requestObject.projectName = localStorage.getItem('projectName');;
                requestObject.maxResults = 10000; //need to see available results
                requestObject.serachType = "";
				if(orphans.m_srcEvent == "TC")
				requestObject.collectionName = "testcases";
				else
					//requestObject.collectionName = "defect_collection";
				requestObject.collectionName = "defects";
				ISE.getSearchResults(requestObject, orphans._receivedSearchResults);

		}
	},
	_receivedSearchResults:function(dataObj) {
		String.prototype.replaceAll = function(target, replacement) {
				return this.split(target).join(replacement);
		};
		dataObj = JSON.parse(JSON.stringify(dataObj).replaceAll("<","&lt;").replaceAll(">","&gt;")
.replaceAll("&lt;em","<em").replaceAll("&lt;/em&gt;","</em>").replaceAll("'iseH'&gt;","'iseH'>").replaceAll("'iseH'&lt;","'iseH'>"));
		if(orphans.m_srcEvent == "TC") {
			$('#searchResultsTable_orphansT').show();
			$("#largeorph > div > div > div.modal-footer #btn_change").show()
			ISEUtils.populateResults(dataObj,"orphansT","TestCase",orphans, false);
		}else if(orphans.m_srcEvent == "IDO" || orphans.m_srcEvent == "EDO"){
			$('#searchResultsTable_orphansD').show();
			ISEUtils.populateResults(dataObj,"orphansD","Defects",orphans, true);
			
		}
		else {
			$('#searchResultsTable_orphansD').show();
			ISEUtils.populateResults(dataObj,"orphansD","Defects",orphans, false);
			$('#btn_change').show();
		}
	},

	renderPopupP:function(feature,srcEvent,e,event) {
		
		if(parseInt($(e).children("div.col-md-5").text())<1){
			event.stopPropagation();
			event.preventDefault();
			return false;
		}
		orphans.m_feature = unescape(feature);
		orphans.m_srcEvent=srcEvent;
		$('#searchResultsTable_orphansDP').hide();
		$('#searchResultsTable_orphansTP').hide();
			
		var filter = 'primary_feature.keyword:"'+unescape(orphans.m_feature)+'"';
			if(orphans.m_srcEvent == "ID")
				filter = filter +'  AND internaldefect: \"1\" AND _exists_:testcases';
			if(orphans.m_srcEvent == "IDO"){
				filter = filter +'  AND internaldefect: \"1\" ';
				var requestObject = new Object();
                requestObject.title = "";
                requestObject.searchString = filter.replace(/\//g, " ");				
                requestObject.filterString = "";
                requestObject.projectName = localStorage.getItem('projectName');;
                requestObject.maxResults = 10000; 
                requestObject.serachType = "";				
				requestObject.collectionName = "defects";
				ISE.getinternalorphans(requestObject, orphans._receivedSearchResults);
			
			}
			if(orphans.m_srcEvent == "ED")
				filter = filter +'  AND internaldefect: \"0\" AND _exists_:testcases';
			if(orphans.m_srcEvent == "EDO"){
				filter = filter +'  AND internaldefect: \"1\" ';
				var requestObject = new Object();
                requestObject.title = "";
                requestObject.searchString = filter.replace(/\//g, " ");				
                requestObject.filterString = "";
                requestObject.projectName = localStorage.getItem('projectName');;
                requestObject.maxResults = 10000; 
                requestObject.serachType = "";				
				requestObject.collectionName = "defects";
				ISE.getinternalorphans(requestObject, orphans._receivedSearchResults);
			}
				
			var requestObject = new Object();

                requestObject.title = "";
                requestObject.searchString = filter.replace(/\//g, " ");
                requestObject.filterString = "";
                requestObject.projectName = localStorage.getItem('projectName');;
                requestObject.maxResults = 10000; //need to see available results
                requestObject.serachType = "";
				if(orphans.m_srcEvent == "TC")
					//requestObject.collectionName = "testcase_collection";
				requestObject.collectionName = "testcases";
				else
					//requestObject.collectionName = "defect_collection";
				requestObject.collectionName = "defects";
				ISE.getSearchResults(requestObject, orphans._receivedSearchResultsP);
				ISEUtils.defectIdcount=[];
				ISEUtils.tableData = [];
				
	},
	
	_receivedSearchResultsP:function(dataObj) {
		if(orphans.m_srcEvent == "TC") {
			$('#searchResultsTable_orphansTP').show();
				
			ISEUtils.populateResults(dataObj,"orphansTP","TestCase",orphans);
		}else if(orphans.m_srcEvent == "IDO" || orphans.m_srcEvent == "EDO"){
			$('#searchResultsTable_orphansDP').show();
			ISEUtils.populateResults(dataObj,"orphansDP","Defects",orphans, true);
			
		}
		else {
			$('#searchResultsTable_orphansDP').show();
			ISEUtils.populateResults(dataObj,"orphansDP","Defects",orphans);
		}
	},
	changeFeatureBtnHandler:function(){

		
       console.log("defectId>>><<<<<<---->"+ISEUtils.defectIdcount);

       orphans.secondaryFeatureParent = new Array();
		

		if(ISEUtils.defectIdcount.length>0)
		{
		  $('#large1').modal("show");
		}
		else
		{
			alert("please select atleast one checkbox");
		}
		
		
		

		
	},
	radioBtnValue:function(event){

	
		orphans.primaryValue = unescape($(event).attr("value"))
		
		orphans.primaryParentValue  = unescape($(event).attr("primaryParent"));

	    orphans.selectedPrimaryfeature = orphans.primaryValue;
		
		 $("#tree_2").jstree("deselect_all");


		//console.log("primary feature: "+primaryValue);
		
	
	},
	clearCheckboxes:function(){
		$('#tree_2').jstree(true).deselect_all();
	
		   refresh=true;
			$("#tree_2").jstree("refresh");
			$("#tree_2").jstree("deselect_all");
			 $('input[name="primary"]').attr('checked', false);
			  $('#largefeature').modal('hide');
			   $('#large1').modal('hide');			
              orphans.primaryValue="";

	},

	

	uiGetParents:function(loSelectedNode) {
        try {
           var loData = [];
            var lnLevel = loSelectedNode.node.parents.length;
            var lsSelectedID = loSelectedNode.node.id;
            var loParent = $("#" + lsSelectedID);
            var lsParents =  loSelectedNode.node.text + ' >';
            loData.push(loSelectedNode.node.text);
            for (var ln = 0; ln <= lnLevel -1 ; ln++) {
                var loParent = loParent.parent().parent();
             
                if (loParent.children()[2] != undefined) {
                    lsParents += loParent.children()[2].text + " > ";
                    loData.push(loParent.children()[2].text);                    
                }
            }
            if (lsParents.length > 0) {
                lsParents = lsParents.substring(0, lsParents.length - 1);
            }
            loData.reverse();         
            return loData;
        }
        catch (err) {
            console.log('Error in uiGetParents');
        }
    },
	
	markAsCreateBtn:function(data){
		orphans.defectIDValue = $(data).parent().parent().attr('defectid');
		var jsonStrObj ={"tcMap" : "Mark as created" };
				var jsonString='{"requesttype":"updateObjectModel","collection":"defects","columnname":"defectid","columnvalue":"'+orphans.defectIDValue+'","object":'+JSON.stringify(jsonStrObj)+',"projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}';
				console.log("jsonstring data chanding defects---"+JSON.stringify(jsonStrObj))
				ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString,orphans._receivedOrphanResultsFlag);
		
		
	},
	markAsCreateBtn:function(data){
		orphans.defectIDValue = $(data).parent().parent().attr('defectid');
		var jsonStrObj ={"tcMap" : "Mark as created" };
				var jsonString='{"requesttype":"updateObjectModel","collection":"defects","columnname":"defectid","columnvalue":"'+orphans.defectIDValue+'","object":'+JSON.stringify(jsonStrObj)+',"projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}';
				console.log("jsonstring data chanding defects---"+JSON.stringify(jsonStrObj))
				ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString,orphans._receivedOrphanResultsFlag);
		
		
	},
	   
		assignTestcaseOrphan:function(data){
			
			 
			/*var nTr = $(data).parents('tr')[0];
            var tID = $(data).closest('table').attr('id');
			var oTable = $('#' + tID).dataTable();
			var currectSelectedTabel = oTable.DataTable();
			var aData = oTable.fnGetData(nTr);

             orphans.defectIDValue = $(aData[2]).text();
             var defectTitle = $(aData[3]).text();
             var defectDesc= $(aData[4]).text();
			 $(".idValue").empty();
			 $(".titleValue").empty();
			 $(".idValue").append(orphans.defectIDValue);
			  $(".titleValue").append(defectTitle);*/
			 
			 orphans.defectIDValue = $(data).parent().parent().attr('defectid');
			 var defectTitle = $(data).parent().parent().attr('title');
             var defectDesc= $(data).parent().parent().attr('description');
			 $(".idValue").empty();
			 $(".titleValue").empty();
			 $(".idValue").append(orphans.defectIDValue);
			  $(".titleValue").append(defectTitle);
			 String.prototype.replaceAll = function(target, replacement) {
                            return this.split(target).join(replacement);
                        };
                        
                         
			//console.log("defTitle"+defTitle);
			
			
			//var defectID = data.attributes["defid"].value;
		
			 var requestObject = new Object();

            requestObject.title = defectTitle;//$('#similarSearch_searchTitle').val().replace(/\//g, " ");
            //requestObject.searchString = requestObject.title + ' ' + $('#similarSearch_searchDescription').val().replace(/\//g, " ");
			requestObject.searchString = defectDesc.replace(/\//g, " ");
            //requestObject.projectName = defectsearch.projectName;
			requestObject.projectName = localStorage.getItem('multiProjectName');
            requestObject.maxResults = 10;
            //requestObject.filterString = defectsearch._getFiltersAsString();
            requestObject.serachType = "conextsearch";


                //requestObject.collectionName = "testcase_collection";
				requestObject.collectionName = "testcases";
               // requestObject.filterString = defectsearch._getAdditionalFilters(collectionName,requestObject);
                ISE.getSearchResults(requestObject, orphans._receivedTestCaseSearchResults);	
			
		
			  $('#orphanTestcasePopup').modal("show");
			  		
			
		
			
		},
		_receivedTestCaseSearchResults: function(data){
			debugger;
			console.log(data)
			ISEUtils.populateResults(data,"TCAA","TestCase",orphans, false, false);
			
		},
		getTestCaseIdsFromSelection : function(){
				var TestArray=[];
			$('#resultTabContent_TCAA table input[type=checkbox]:checked').each(function () {			
				//var value = this.id;
						
				var nTr = $(this).parents('tr')[0];
				var tID = $(this).closest('table').attr('id');
				var oTable = $('#' + tID).dataTable();
				var currectSelectedTabel = oTable.DataTable();
				var aData = oTable.fnGetData(nTr);
				
				 var defectID = $(aData[2]).text();	 
				  var title = $(aData[3]).text();
				  console.log("------------------defectID-->"+defectID);
				 TestArray.push(defectID)
				 TestArray.push(title)
					
				
			});
			return TestArray
		},
		
		searchResult: function(){
			
			
			
			
			/* var nTr = $(data).parents('tr')[0];
            var tID = $(data).closest('table').attr('id');
			var oTable = $('#' + tID).dataTable();
			var currectSelectedTabel = oTable.DataTable();
			var aData = oTable.fnGetData(nTr);

             orphans.defectIDValue = $(aData[2]).text();
             var defectTitle = $(aData[3]).text();
             var defectDesc= $(aData[4]).text(); */
			  var defectTitle = $("#orphanTestcasePopup #searchResultsTable_TCAA #serachInput").val();
			 String.prototype.replaceAll = function(target, replacement) {
                            return this.split(target).join(replacement);
                        };
                        
                         
			//console.log("defTitle"+defTitle);
			
			
			//var defectID = data.attributes["defid"].value;
		
			 var requestObject = new Object();

            requestObject.title = defectTitle;
            
			//requestObject.searchString = defectDesc.replace(/\//g, " ");
            
			requestObject.projectName = localStorage.getItem('multiProjectName');
            requestObject.maxResults = 10;
            //requestObject.filterString = defectsearch._getFiltersAsString();
            requestObject.serachType = "conextsearch";



           
                //requestObject.collectionName = "testcase_collection";
				requestObject.collectionName = "testcases";
               // requestObject.filterString = defectsearch._getAdditionalFilters(collectionName,requestObject);
                ISE.getSearchResults(requestObject, orphans._receivedTestCaseSearchResults);	
			
		
			 // $('#orphanTestcaseTitlePopup').modal("show");
			  $('#orphanTestcasePopup').modal("show");
			  		
		},
	  removeTestCase:function(testcaseIdValue,defectIdValue){
			ISEUtils.portletBlockingCluster("pageContainer");
			$("#largeorph").modal("hide");
			var jsonString='{"requesttype":"removeJsonArrayDynamically","collection":"defects","columnname":"_id","columnvalue":"'+defectIdValue+'","testcaseName":"test_case_id","testcaseValue":"'+testcaseIdValue+'","jsonArrayField":"testcases","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}';
			
				console.log("jsonstring data chanding defects---"+jsonString)
				
			ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString,orphans._receivedOrphanResultsFlag);
			setTimeout(function(){
			ISEUtils.portletUnblockingCluster("pageContainer");
			onHashChange();			
			$(".modal-backdrop.fade.in").remove();
			},8000);	

      },

	  confirmTestCase:function(testcaseIdValue,defectIdValue){

			var jsonString='{"requesttype":"updateJsonArrayFieldByIds","collection":"defects","columnname":"defectid","columnvalue":"'+defectIdValue+'","testcaseName":"test_case_id","testcaseValue":"'+testcaseIdValue+'","testcaseStatusName":"status","testcaseStatusValue":"Confirmed","jsonArrayField":"testcases","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}';
			
			console.log("jsonstring data chanding defects---"+jsonString)
				
				ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString,orphans._receivedOrphanResultsFlag);


      },
	  updateTestCase:function(testcaseIdValue,defectIdValue){
	  
		  	var jsonString='{"requesttype":"updateJsonArrayFieldByIds","collection":"defects","columnname":"defectid","columnvalue":"'+defectIdValue+'","testcaseName":"test_case_id","testcaseValue":"'+testcaseIdValue+'","testcaseStatusName":"action","testcaseStatusValue":"mark_for_update","jsonArrayField":"testcases","projectName":"' + localStorage.getItem('projectName') + '","fromCache":"false"}';
			
			console.log("jsonstring data chanding defects---"+jsonString)
				
			ISE_Ajax_Service.ajaxPostReq('ObjectModelRestService', 'json', localStorage.authtoken,jsonString,orphans._receivedOrphanResultsFlag);
      },
	 markAsCreate:function(){
                                url="http://10.98.11.18/DevTest/dashboard/#/visualize/edit/MarkForCreate?embed&_g=(time:(from:now-5y,mode:quick,to:now))&_a=(filters:!(),linked:!f,query:(query_string:(analyze_wildcard:!t,query:'_missing_:testcases')),vis:(aggs:!((id:'1',params:(),schema:metric,type:count),(id:'2',params:(field:defect_id,order:desc,orderBy:'1',size:2000),schema:bucket,type:terms),(id:'3',params:(field:defect_title,order:desc,orderBy:'1',size:5),schema:bucket,type:terms),(id:'4',params:(field:tcMap,order:desc,orderBy:'1',size:5),schema:bucket,type:terms)),listeners:(),params:(perPage:10,showMeticsAtAllLevels:!f,showPartialRows:!f),type:table))"
           $('#markAscreate').attr('src',url )
           $("#showDashboardInfo").modal("show");         
         
      },
                  markAsUpdate:function(){
                                   url="http://10.98.11.18/DevTest/dashboard/#/visualize/edit/MarkForUpdate?embed&_g=(time:(from:now-5y,mode:quick,to:now))&_a=(filters:!(),linked:!f,query:(query_string:(analyze_wildcard:!t,query:'*')),vis:(aggs:!((id:'1',params:(),schema:metric,type:count),(id:'2',params:(field:defect_id,order:desc,orderBy:'1',size:2000),schema:bucket,type:terms),(id:'3',params:(field:defect_title,order:desc,orderBy:'1',size:5),schema:bucket,type:terms),(id:'4',params:(field:testcases.test_case_id,order:desc,orderBy:'1',size:5),schema:bucket,type:terms),(id:'5',params:(field:testcases.action,order:desc,orderBy:'1',size:5),schema:bucket,type:terms)),listeners:(),params:(perPage:10,showMeticsAtAllLevels:!f,showPartialRows:!f),type:table))"
           $('#markAscreate').attr('src',url )
           $("#showDashboardInfo").modal("show");         
         
      },



	
};

