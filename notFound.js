

module.exports = (req, resp) => {
   resp.status(404).json({
      'message': 'Page not found'
   });
};