export function indexRoute(req, res) {
  const response = {
    welcome: 'This is the route API'
  };
  res.status(200).json(response);
}
