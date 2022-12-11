const express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose');
	
const crawl = require("../reptile/crawl.js");
const crawlerGET = crawl.crawlerGET;

router.get('/school', (req, res) => {
	crawlerGET("schools",(webData) => {
		const data = [];
		for(const i in webData){
			if(webData[i]["name"] !== ''){
				data.push({code:i,name:webData[i]["name"]});
			}
		}
		res.send({schools:data});
	});
});

router.get('/subject', (req, res) => {
	crawlerGET("subjects",(webData) => {
		const data = [];
		for(const i in webData[req.query.school]){
			data.push({code:i,name:webData[req.query.school][i]["name"],school:req.query.school});
		}
		res.send({subjects:data,pages:1});
	});
});

router.get('/course', (req, res) => {
	crawlerGET("current/fa/"+req.query.school+'/'+req.query.subject,(webData) => {
		const data = [];
		for(const i in webData){
			for(const j in webData[i]["sections"]){
				const professor = webData[i]["sections"][j]["instructors"][0];
				let url = '';
				if(professor !== "Staff"){
					const query = professor.split(' ');
					url = "https://www.ratemyprofessors.com/search/teachers?query=" + query[0]+"%20"+query[1]+ "&sid=U2Nob29sLTY3NQ==";
				}

				data.push({code:webData[i]['subjectCode']["code"],
				ID:webData[i]['subjectCode']["code"]+'-'+webData[i]['subjectCode']["school"]+' ' + webData[i]["deptCourseId"],
				registrationNumber: webData[i]["sections"][j]["registrationNumber"],
				instructors: webData[i]["sections"][j]["instructors"],
				type: webData[i]["sections"][j]["type"],
				status: webData[i]["sections"][j]["status"],
				meetings: webData[i]["sections"][j]["meetings"],
				recitations: webData[i]["sections"][j]["recitations"],
				waitlistTotal: webData[i]["sections"][j]["waitlistTotal"],
				instructionMode: webData[i]["sections"][j]["instructionMode"],
				rmpUrl:url,
				name: webData[i]["sections"][j]["name"],
				campus: webData[i]["sections"][j]["campus"],
				minUnits: webData[i]["sections"][j]["minUnits"],
				maxUnits: webData[i]["sections"][j]["maxUnits"],
				grading: webData[i]["sections"][j]["grading"],
				location: webData[i]["sections"][j]["location"],
				notes: webData[i]["sections"][j]["notes"],
				prerequisites: webData[i]["sections"][j]["prerequisites"],
				school:req.query.school,
				subject:req.query.subject,
			});
			}
		}
		res.send({courses:data});
	});
});

router.get('/search', (req, res) => {
	if(req.query.number === undefined){
		return;
	}
	if(req.query.number !== '' && req.query.semester !== '' && req.query.year !== ''){
		crawlerGET(req.query.year + "/" + req.query.semester + "/"+req.query.number,(webData) => {
			const data = [];
			for(const i in webData){
				data.push({ID:webData[i]['subjectCode']["code"]+'-'+webData[i]['subjectCode']["school"]+' ' + webData[i]["deptCourseId"],name:webData[i]["name"],sections:webData[i]["sections"]});
			}
			res.render('list-courses',{school:req.query.school,subject:req.query.subject,courses:data});
		});
		return;
	}
    if(req.query.year !== '' && req.query.semester !== '' && req.query.school !== '' && req.query.course !== ''){
		console.log(req.query.year + "/" + req.query.semester + "/"+req.query.school+'/'+req.query.course);
		crawlerGET(req.query.year + "/" + req.query.semester + "/"+req.query.school+'/'+req.query.course,(webData) => {
			const data = [];
			for(const i in webData){
				data.push({ID:webData[i]['subjectCode']["code"]+'-'+webData[i]['subjectCode']["school"]+' ' + webData[i]["deptCourseId"],name:webData[i]["name"],sections:webData[i]["sections"]});
			}
			res.render('list-courses',{school:req.query.school,subject:req.query.subject,courses:data});
		});
		return;
	}
	if(req.query.school !== ''){
		crawlerGET("subjects",(webData) => {
			const data = [];
			for(const i in webData[req.query.school]){
				data.push({shortname:i,name:webData[req.query.school][i]["name"]});
			}
			res.render('list-subjects',{school:req.query.school,subjects:data});
		});
		return;
	}
});
module.exports = router;
