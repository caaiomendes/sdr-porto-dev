<?php

namespace App\Http\Middleware;

use App\Exceptions\ThrottleException;
use Closure;
use Illuminate\Cache\RateLimiter;
use Response;
use RuntimeException;
use App\Http\Controllers\CustomController;
use Tymon\JWTAuth\Facades\JWTAuth;

class ThrottleRequests extends \Tymon\JWTAuth\Middleware\BaseMiddleware
{
    /**
     * The rate limiter instance.
     *
     * @var \Illuminate\Cache\RateLimiter
     */
    protected $limiter;


    /**
     * Create a new request throttler.
     *
     * @param  \Illuminate\Cache\RateLimiter $limiter
     */
    public function __construct(RateLimiter $limiter)
    {
        $this->limiter = $limiter;
    }


    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure                 $next
     * @param  int                      $maxAttempts
     * @param  int                      $decayMinutes
     *
     * @return mixed
     * @throws ThrottleException
     */
    public function handle($request, Closure $next, $maxAttempts = 60, $decayMinutes = 1)
    {

/*
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (Exception $e) {
            // if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
            //     return response()->json(['status' => 'Token is Invalid']);
            // }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException){
            //     return response()->json(['status' => 'Token is Expired']);
            // }else{
            //     return response()->json(['status' => 'Authorization Token not found']);
            // }
        }

        $key = $this->resolveRequestSignature($request);

        if ($this->limiter->tooManyAttempts($key, $maxAttempts, $decayMinutes)) {
            //gravando log na tabela de auditoria
            (new CustomController)->inserirLogDeAuditoria($request->ip(), $user->email, 'Simulando - Bloqueio por excesso de tentativas', 'Configuração: maxAttempts: ' .$maxAttempts. ', decayMinutes: '.$decayMinutes.'');
            
            //liberando acesso
            return $next($request);
            
            //bloqueando acesso
            // return response()->json(['status' => 'error', 'message' => 'Excesso de tentativas'], 429);

        }
        
        $this->limiter->hit($key, $decayMinutes);
        
        $response = $next($request);

        $response->headers->add([
            'X-RateLimit-Limit' => $maxAttempts,
            'X-RateLimit-Remaining' => $maxAttempts - $this->limiter->attempts($key) + 1,
        ]);

*/
	 return $next($request);
        //return $response;
    }

    /**
     * Resolve request signature.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string
     */
    protected function resolveRequestSignature($request)
    {
        return $this->fingerprint($request);
    }


    /**
     * Get a unique fingerprint for the request / route / IP address.
     *
     * @return string
     *
     * @throws \RuntimeException
     */
    public function fingerprint($request)
    {
        if (! $request->route()) {
            throw new RuntimeException('Unable to generate fingerprint. Route unavailable.');
        }

        return sha1(
            implode('|', $request->route()->methods()).
            '|'.$request->route()->domain().
            '|'.$request->route()->uri().
            '|'.$request->ip()
        );
    }
}
