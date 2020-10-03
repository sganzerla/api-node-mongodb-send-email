
export async function index(req, res) {
    return res.send({ message: 'ok', user: req.userId })
}