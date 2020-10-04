/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const issueSchema = new mongoose.Schema({
  issue_title: String,
  issue_text: String,
  created_by: String,
  assigned_to: String,
  status_text: String,
  created_on: Date,
  updated_on: Date,
  open: Boolean
});
const Issue = mongoose.model('Issue', issueSchema);

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async (req, res) => {
      let filter = {};

      if(req.query.assigned_to) 
        filter.assigned_to = req.query.assigned_to;

      if(req.query.open) 
        filter.open = req.query.open;

      if(req.query.issue_title) 
        filter.issue_title = req.query.issue_title;

      let issues = await Issue.find(filter).exec();

      res.json(issues);
    })
    
    .post(function (req, res){
      if(
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        res.send('validation failed');
        return;
      }

      const issue = new Issue({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        created_on: new Date(),
        updated_on: new Date(),
        open: true
      });

      issue.save((error, data) => {
        if(error) console.log(error);
        
        res.json(data);
      });
    })
    
    .put(function (req, res){

      if(Object.keys(req.body).length === 0) {
        res.send('no body');
        return;
      }

      if(!req.body._id) {
        res.send('validation failed');
        return;
      }

      const issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        updated_on: new Date(),
        open: req.body.open == 'on' ? true : false
      };

      Issue.findByIdAndUpdate(req.body._id, issue, (error, data) => {
        if(error) {
          res.send('could not update ' + req.body._id);

          return;
        }
        
        res.send('successfully updated');
      });
      
    })
    
    .delete(function (req, res){
      if(
        !req.body._id
      ) {
        res.send('_id error');
        return;
      }

      Issue.deleteOne(
        {_id: req.body._id},
        (error, data) => {
          if(error) {
            res.send('could not delete ' + req.body._id);

            return;
          }
          
          res.send('deleted ' + req.body._id);
        }
      );
      
    });
    
};
