//
//  FlurrySmoke.m
//  Flurry
//
//  Created by Satish on 5/6/15.
//  Copyright (c) 2015 Satish Maha Software. All rights reserved.
//

#import "FlurrySmoke.h"

#import "Constants.h"
#import "Math.h"
#import "State.h"

#define MAXANGLES 16384
#define NOT_QUITE_DEAD 3

#define intensity 75000.0f;

@interface FlurrySmoke ()

@property (nonatomic, strong) Buffers *buffers;

@end

@implementation FlurrySmoke

- (instancetype)initWithBuffers:(Buffers *)buffers
{
    self = [super init];
    if (self)
    {
        _buffers = buffers;
        
        self.nextParticle = 0;
        self.nextSubParticle = 0;
        self.lastParticleTime = 0.25f;
        self.firstTime = YES;
        self.frame = 0;
        for (NSInteger i=0;i<3;i++)
        {
            self->oldPos[i] = [self randomFloatBetween:-100.0 and:100.0];;
        }
    }
    
    return self;
}

- (float)randomFloatBetween:(float)smallNumber and:(float)bigNumber
{
    float diff = bigNumber - smallNumber;
    return (((float) (arc4random() % ((unsigned)RAND_MAX + 1)) / RAND_MAX) * diff) + smallNumber;
}

- (void)updateSmoke
{
    State *state = [State sharedState];
    CGFloat starPosX = state.star->position[0];
    CGFloat starPosY = state.star->position[1];
    CGFloat starPosZ = state.star->position[2];
    
    self.frame++;
    
    if (self.firstTime)
    {
        self.firstTime        = false;
        self.lastParticleTime = state.time;
    }
    else if (state.time - self.lastParticleTime >= 1 / 121.0f)
    {
        CGFloat dx = self->oldPos[0] - starPosX;
        CGFloat dy = self->oldPos[1] - starPosY;
        CGFloat dz = self->oldPos[2] - starPosZ;
        
        CGFloat deltaPos[3];
        
        deltaPos[0] = dx * 5;
        deltaPos[1] = dy * 5;
        deltaPos[2] = dz * 5;
        
        for (NSInteger i = 0; i < state.numOfStreams; i++)
        {
            self->particles[self.nextParticle].deltaPos[0].f[self.nextSubParticle] = deltaPos[0];
            self->particles[self.nextParticle].deltaPos[1].f[self.nextSubParticle] = deltaPos[1];
            self->particles[self.nextParticle].deltaPos[2].f[self.nextSubParticle] = deltaPos[2];
            self->particles[self.nextParticle].pos[0].f[self.nextSubParticle]      = starPosX;
            self->particles[self.nextParticle].pos[1].f[self.nextSubParticle]      = starPosY;
            self->particles[self.nextParticle].pos[2].f[self.nextSubParticle]      = starPosZ;
            self->particles[self.nextParticle].oldPos[0].f[self.nextSubParticle]   = starPosX;
            self->particles[self.nextParticle].oldPos[1].f[self.nextSubParticle]   = starPosY;
            self->particles[self.nextParticle].oldPos[2].f[self.nextSubParticle]   = starPosZ;
            
            CGFloat streamSpeedCoherenceFactor = fmaxf( 0, 1 + RandBell(0.25*incohesion));
            
            CGFloat dX  = self->particles[self.nextParticle].pos[0].f[self.nextSubParticle] - state->spark[i]->pos[0];
            CGFloat dY  = self->particles[self.nextParticle].pos[1].f[self.nextSubParticle] - state->spark[i]->pos[1];
            CGFloat dZ  = self->particles[self.nextParticle].pos[2].f[self.nextSubParticle] - state->spark[i]->pos[2];
            CGFloat rsq = (dX*dX+dY*dY+dZ*dZ);
            CGFloat f   = streamSpeed * 10 * streamSpeedCoherenceFactor;
            
            CGFloat mag = (sqrt(rsq)/rsq) * f;
            
            self->particles[self.nextParticle].deltaPos[0].f[self.nextSubParticle] -= (dX * mag);
            self->particles[self.nextParticle].deltaPos[1].f[self.nextSubParticle] -= (dY * mag);
            self->particles[self.nextParticle].deltaPos[2].f[self.nextSubParticle] -= (dZ * mag);
            self->particles[self.nextParticle].color[0].f[self.nextSubParticle] = state->spark[i]->color[0] * (1 + RandBell(colorIncoherence));
            self->particles[self.nextParticle].color[1].f[self.nextSubParticle] = state->spark[i]->color[1] * (1 + RandBell(colorIncoherence));
            self->particles[self.nextParticle].color[2].f[self.nextSubParticle] = state->spark[i]->color[2] * (1 + RandBell(colorIncoherence));
            self->particles[self.nextParticle].color[3].f[self.nextSubParticle] = 0.85 * (1.0 + RandBell(0.5 * colorIncoherence));
            self->particles[self.nextParticle].time.f[self.nextSubParticle]  = state.time;
            self->particles[self.nextParticle].dead.i[self.nextSubParticle]  = 0;
            self->particles[self.nextParticle].animFrame.i[self.nextSubParticle] = (int)floor(rand() * 32767) & 63;
            
            self.nextSubParticle++;
            
            if (self.nextSubParticle == 4)
            {
                self.nextSubParticle = 0;
                self.nextParticle++;
            }
            
            if (self.nextParticle >= NUMSMOKEPARTICLES / 4)
            {
                self.nextParticle    = 0;
                self.nextSubParticle = 0;
            }
        }
        
        self.lastParticleTime = state.time;
    }
    
    self->oldPos[0] = state.star->position[0];
    self->oldPos[1] = state.star->position[1];
    self->oldPos[2] = state.star->position[2];
    
    for (NSInteger i = 0; i < NUMSMOKEPARTICLES / 4; i++)
        for (NSInteger k = 0; k < 4; k++)
        {
            if (self->particles[i].dead.i[k] == 1)
            {
                continue;
            }
            
            CGFloat deltaX = self->particles[i].deltaPos[0].f[k];
            CGFloat deltaY = self->particles[i].deltaPos[1].f[k];
            CGFloat deltaZ = self->particles[i].deltaPos[2].f[k];
            
            deltaX *= state.drag;
            deltaY *= state.drag;
            deltaZ *= state.drag;
            
            if( (deltaX*deltaX+deltaY*deltaY+deltaZ*deltaZ) >= 25000000 )
            {
                self->particles[i].dead.i[k] = 1;
                continue;
            }
            
            self->particles[i].deltaPos[0].f[k] = deltaX;
            self->particles[i].deltaPos[1].f[k] = deltaY;
            self->particles[i].deltaPos[2].f[k] = deltaZ;
            
            for (NSInteger j = 0; j < 3; j++)
            {
                self->particles[i].oldPos[j].f[k] = self->particles[i].pos[j].f[k];
                self->particles[i].pos[j].f[k] += (self->particles[i].deltaPos[j].f[k]) * state.deltaTime;
            }
        }
    
}

- (void)drawSmoke
{
    SmokeParticleV particle;
    NSInteger svii = 0;
    NSInteger svi  = 0;
    NSInteger sii  = 0;
    NSInteger sti  = 0;
    NSInteger sci  = 0;
    NSInteger si   = 0;
    State *state       = [State sharedState];
    CGFloat screenW     = state.screenWidth;
    CGFloat screenH     = state.screenHeight;
    CGFloat screenRatio = screenW / screenH;
    CGFloat wslash2     = screenW * 0.5;
    CGFloat hslash2     = screenH * 0.5;
    CGFloat width       = (streamSize + 2.5 * streamExpansion) * screenRatio;
    
    memset(self->seraphimVertices,0,sizeof(self->seraphimVertices));
    
    // Per particle (group of four quads)
    for (NSInteger i = 0; i < NUMSMOKEPARTICLES / 4; i++)
    {
        particle = self->particles[i];
        // Per quad in a particle
        for (NSInteger k = 0; k < 4; k++)
        {
            if (self->particles[i].dead.i[k] == 1)
                continue;
            
            CGFloat selfWidth = (streamSize + (state.time - self->particles[i].time.f[k]) * streamExpansion) * screenRatio;
            
            if (selfWidth >= width)
            {
                self->particles[i].dead.i[k] = 1;
                continue;
            }
            
            CGFloat z    = self->particles[i].pos[2].f[k];
            CGFloat sx   = self->particles[i].pos[0].f[k] * screenW / z + wslash2;
            CGFloat sy = self->particles[i].pos[1].f[k] * screenW / z + hslash2;
            CGFloat oldz = self->particles[i].oldPos[2].f[k];
            
            // Do not draw if out of bounds
            if (sx > screenW + 50 || sx < -50 || sy > screenH + 50 || sy < -50 || z < 25 || oldz < 25)
                continue;
            
            CGFloat w    = fmaxf(1, selfWidth / z);
            CGFloat oldx = self->particles[i].oldPos[0].f[k];
            CGFloat oldy = self->particles[i].oldPos[1].f[k];
            
            CGFloat oldscreenx = (oldx * screenW / oldz) + wslash2;
            CGFloat oldscreeny = (oldy * screenW / oldz) + hslash2;
            CGFloat dx = (sx - oldscreenx);
            CGFloat dy = (sy - oldscreeny);
            CGFloat d  = FastDistance2D(dx, dy);
            CGFloat sm = d ? w / d : 0.0;
            CGFloat ow = fmaxf(1, selfWidth / oldz);
            CGFloat os = d ? ow / d : 0.0;
            
            CGFloat cmv[4];
            
            CGFloat m    = 1 + sm;
            CGFloat dxs  = dx * sm;
            CGFloat dys  = dy * sm;
            CGFloat dxos = dx * os;
            CGFloat dyos = dy * os;
            CGFloat dxm  = dx * m;
            CGFloat dym  = dy * m;
            
            self->particles[i].animFrame.i[k]++;
            
            if (self->particles[i].animFrame.i[k] >= 64)
                self->particles[i].animFrame.i[k] = 0;
            
            CGFloat u0 = (self->particles[i].animFrame.i[k] & 7) * 0.125;
            CGFloat v0 = (self->particles[i].animFrame.i[k] >> 3) * 0.125;
            CGFloat u1 = u0 + 0.125;
            CGFloat v1 = v0 + 0.125;
            //1 = brightness
            CGFloat cm = .375 * 1;
            
            cmv[0] = self->particles[i].color[0].f[k] * cm;
            cmv[1] = self->particles[i].color[1].f[k] * cm;
            cmv[2] = self->particles[i].color[2].f[k] * cm;
            cmv[3] = self->particles[i].color[3].f[k] * cm;
            
            for (NSInteger ci = 0; ci < 4; ci++)
            {
                self->seraphimColors[sci++] = cmv[0];
                self->seraphimColors[sci++] = cmv[1];
                self->seraphimColors[sci++] = cmv[2];
                self->seraphimColors[sci++] = cmv[3];
            }
            
            self->seraphimTextures[sti++] = u0;
            self->seraphimTextures[sti++] = v0;
            self->seraphimTextures[sti++] = u1;
            self->seraphimTextures[sti++] = v0;
            self->seraphimTextures[sti++] = u0;
            self->seraphimTextures[sti++] = v1;
            self->seraphimTextures[sti++] = u1;
            self->seraphimTextures[sti++] = v1;
            
            // Each seraphimVertices vector held the XY of two points in a quad
            CGFloat offset = 0;
            self->seraphimVertices[svi++] = sx + dxm - dys + offset;
            self->seraphimVertices[svi++] = sy + dym + dxs + offset;
            self->seraphimVertices[svi++] = sx + dxm + dys + offset;
            self->seraphimVertices[svi++] = sy + dym - dxs + offset;
            self->seraphimVertices[svi++] = oldscreenx - dxm - dyos + offset;
            self->seraphimVertices[svi++] = oldscreeny - dym + dxos + offset;
            self->seraphimVertices[svi++] = oldscreenx - dxm + dyos + offset;
            self->seraphimVertices[svi++] = oldscreeny - dym - dxos + offset;
            
            self->seraphimIndices[sii++] = svii;
            self->seraphimIndices[sii++] = svii + 2;
            self->seraphimIndices[sii++] = svii + 1;
            self->seraphimIndices[sii++] = svii + 2;
            self->seraphimIndices[sii++] = svii + 3;
            self->seraphimIndices[sii++] = svii + 1;
            
            si++; svii += 4;
        }
    }
    
    memcpy(self.buffers->positionData, self->seraphimVertices, sizeof(self.buffers->positionData));

    int indexDataCount = sizeof(self.buffers->indexData)/sizeof(self.buffers->indexData[0]);
    for (NSInteger index = 0; index < indexDataCount; index++)
    {
        self.buffers->indexData[index] = self->seraphimIndices[index];
    }
    
    memcpy(self.buffers->colorData, self->seraphimColors, sizeof(self.buffers->colorData));
    
    memcpy(self.buffers->uvData, self->seraphimTextures, sizeof(self.buffers->uvData));

    //    Flurry.renderer.setBuffer('position', self->seraphimVertices);
    //    Flurry.renderer.setBuffer('index',    self->seraphimIndices);
    //    Flurry.renderer.setBuffer('color',    self->seraphimColors);
    //    Flurry.renderer.setBuffer('uv',       self->seraphimTextures);
}

- (CGFloat)randBell:(CGFloat)scale
{
    CGFloat randBell;
    randBell =  (scale * (1.0f - (rand() + rand() + rand()) / ((float) RAND_MAX * 1.5f)));
    if (randBell < 0)
    {
        NSLog(@"negative");
    }
    return randBell;
}


static float FastDistance2D(float x, float y)
{
    // self function computes the distance from 0,0 to x,y with ~3.5% error
    float mn;
    // first compute the absolute value of x,y
    x = (x < 0.0f) ? -x : x;
    y = (y < 0.0f) ? -y : y;
    
    // compute the minimum of x,y
    mn = x<y?x:y;
    
    // return the distance
    return(x+y-(mn*0.5f)-(mn*0.25f)+(mn*0.0625f));
    
}



@end
