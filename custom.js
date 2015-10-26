
var comissionIdCounter = 0;

var data = {
	comissions: []
};


function exportData()
{

	var textToSave = JSON.stringify(data);
	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
	hiddenElement.target = '_blank';
	hiddenElement.download = 'comissions.json';
	hiddenElement.click();
}


function importFail()
{
	alert('Importeren is mislukt');
	importDone();
}

function importDone()
{
	var uploader = $('#uploader');
	uploader.replaceWith( uploader = uploader.clone( true ) );
	document.getElementById('uploader').addEventListener('change', importData, false);
}

function importData(evt)
{
	var f = evt.target.files[0]; 

	if (f) {
		var r = new FileReader();
		r.onload = function(e) { 
			var contents = e.target.result;
			try{
				var d = JSON.parse(contents);
				data = d;

				$('#comissions').html('');
				var max = 0;

				for(var k in data.comissions){
					var comission = data.comissions[k];

					$('#comissions').append('<div id="'+comission.id+'" style="padding-top:10px;" class="row commission-row">'+
		'<div class="col-xs-3 from"> <div class="input-group"> <span class="input-group-addon">€</span> </span> <input value="'+comission.from+'" rowid="'+comission.id+'" inputtype="from" min="0" step="100" type="number" class="form-control"> </div>' +
		'</div>' +
		'<div class="col-xs-3 col-xs-offset-1 to"> <div class="input-group"> <span class="input-group-addon">€</span> </span> <input value="'+comission.to+'"  rowid="'+comission.id+'" inputtype="to" min="0" step="100" type="number" class="form-control"> </div>' +
		'</div>' +
		'<div class="col-xs-2 col-xs-offset-1 percentage"> <div class="input-group"> <span class="input-group-addon">%</span> </span> <input value="'+comission.percentage+'"  rowid="'+comission.id+'" inputtype="percentage" min="0" max="100" step="0.1" type="number" class="form-control"> </div>' +
		'</div>' +
		'<div class="col-xs-1"><button class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span></button></div>' +
		'</div>');
				
				$("#"+comission.id+' input').change(handleInputChange);
				$("#"+comission.id+' button').click(handleDelete.bind(null, comission.id));
				if(comission.id > max){
					max = comission.id;
				}

				}

				comissionIdCounter = max+1;
				recalc();
				importDone();
				return;
			}catch(e){
				console.log(e);
				importFail();
			}
		}
		r.readAsText(f);
	}else{
		importFail();
	}
}


function handleInputChange()
{
	var id = $(this).attr('rowid');
	var type = $(this).attr('inputtype');

	for(var k in data.comissions){
		if(data.comissions[k].id == id){
			data.comissions[k][type] = parseFloat($(this).val());
		}
	}

	recalc();
}

function handleDelete(id)
{
	newComissions = [];

	if(data.comissions.length == 1){
		return;
	}

	for(var k in data.comissions){
		if(data.comissions[k].id == id){
			continue;
		}
		newComissions.push(data.comissions[k]);
	}
	data.comissions = newComissions;
	$('#'+id).remove();

	recalc();
}


function addCommissionRow()
{


	$('#comissions').append('<div id="'+comissionIdCounter+'" style="padding-top:10px;" class="row commission-row">'+
		'<div class="col-xs-3 from"> <div class="input-group"> <span class="input-group-addon">€</span> </span> <input rowid="'+comissionIdCounter+'" inputtype="from" min="0" step="100" type="number" class="form-control"> </div>' +
		'</div>' +
		'<div class="col-xs-3 col-xs-offset-1 to"> <div class="input-group"> <span class="input-group-addon">€</span> </span> <input rowid="'+comissionIdCounter+'" inputtype="to" min="0" step="100" type="number" class="form-control"> </div>' +
		'</div>' +
		'<div class="col-xs-2 col-xs-offset-1 percentage"> <div class="input-group"> <span class="input-group-addon">%</span> </span> <input rowid="'+comissionIdCounter+'" inputtype="percentage" min="0" max="100" step="0.1" type="number" class="form-control"> </div>' +
		'</div>' +
		'<div class="col-xs-1"><button class="btn btn-danger"><span class="glyphicon glyphicon-trash"></span></button></div>' +
		'</div>');

	data.comissions.push({
		id : comissionIdCounter,
		from : 0,
		to : 0,
		percentage: 0
	});



	$("#"+comissionIdCounter+' input').change(handleInputChange);
	$("#"+comissionIdCounter+' button').click(handleDelete.bind(null, comissionIdCounter));

	comissionIdCounter++;
}

function calc(number)
{
	total = 0;
	for(var k in data.comissions)
	{
		comission = data.comissions[k];
		if(number < comission.from) continue;
		var sub = 0;
		if(number >= comission.to){
			sub = comission.to - comission.from;
		}else{
			sub = number - comission.from;
		}

		total += (sub * (comission.percentage / 100));
	}
	total = Math.round(total * 100) / 100; // 2 decimal point
	return total;
}

function recalc()
{
	var value = parseFloat($('#example-input').val());
	$('#example').val(calc(value));

	$('#examples tr').each(function(){
		var price = parseFloat($(this).find('.price').text());
		$(this).find('.result').text(calc(price));
	});
}

(function($){
	$(function(){
		addCommissionRow();
		$('#add-comission-row').click(addCommissionRow);
		$('#example-input').change(recalc);
		document.getElementById('uploader').addEventListener('change', importData, false);
		$('#export').click(exportData);
		recalc();
	});
})(jQuery);
