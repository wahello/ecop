from pyramid.events import subscriber
from pyramid.httpexceptions import HTTPBadRequest
from pyramid_rpc.jsonrpc import jsonrpc_method

from webmodel.base import DBSession
from webmodel.party import Party
from weblibs.jsonrpc import RPCNotAllowedError, RPCUserError


@jsonrpc_method(endpoint='rpc', method='auth.login')
def userLogin(request, login, password): # pylint: disable=W0613
    """
    Verify account password and create authentication token.

    This and 'auth.logout' are the only rpc methods that does not subclass
    RpcBase for they must be invoked without valid user session
    """
    sess = DBSession()
    user = sess.query(Party).filter_by(login=login).first()

    if not user or not user.verifyPassword(password):
        raise RPCUserError('登录失败，请检查用户名和密码！')

    # Only those with defined permission are allowed
    if not user.extraData or not user.extraData['permission']:
        raise RPCNotAllowedError('您无权登录大管家ERP。')

    # after user is authenticated, we cache the user object in redis
    sess.expunge_all()  # detach from session
    request.session['user'] = user

    return {
        'partyId': user.partyId,
        'permission': user.extraData['permission']
    }


@jsonrpc_method(endpoint='rpc', method='auth.logout')
def userLogout(request):
    request.session.invalidate()


@subscriber('pyramid.events.BeforeTraversal')
def authenticator(event):
    """
    When new quest arrives, we look up the authenticated user from session
    and put the following attributes in the request for easier reference later:

        authenticated
        user
    """
    request = event.request

    if not getattr(request, 'matched_route', None):
        return

    # deny bots
    if request.is_bot:
        raise HTTPBadRequest()

    session = request.session
    request.user = session.get('user')
    request.authenticated = bool(request.user)
