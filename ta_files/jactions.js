jQuery(function(d){var c=null;function a(g,e,f){return g+encodeURIComponent('"'+e+'"')+f}function b(){var e=d("input[name=term]"),g='"'+c+'"[jour]',f=e.val();e.val((f===""?"":f+" AND ")+g)}d("#pmcmata").each(function(){var f=d(this);c=f.text().replace(/\.+$/,"");var g={links:[{heading:"Actions"},{text:"Search in PMC",href:a("/pmc?term=",c,"[jour]")},{text:"Search in PubMed",href:a("/pubmed?term=",c,"[jour]")},{text:"View in NLM Catalog",href:a("/nlmcatalog?term=",c,"[Title+Abbreviation]")},{text:"Add to Search",click:b}]};var e=d("<a/>").text(f.text()).attr("href","#").replaceAll(f);e.ncbilinksmenu({hasArrow:true,localJSON:g,triggerPosition:"center auto",destPosition:"center auto",width:"250px"});e.ncbilinksmenu("option","preventDefault",'*[href="#"]')})});