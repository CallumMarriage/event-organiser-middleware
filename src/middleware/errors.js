import url from 'url';

export function error(req, res) {
  var location = url.parse(req.url).pathname;
 
  var response = {
    message: 'Cannot access ' + location
  };

  res.status(404).json(response);
}
