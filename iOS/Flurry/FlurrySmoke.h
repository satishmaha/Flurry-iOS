//
//  FlurrySmoke.h
//  Flurry
//
//  Created by Satish on 5/6/15.
//  Copyright (c) 2015 Satish Maha Software. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "Constants.h"
#import "Renderer.h"
#import "Star.h"
#import "Spark.h"

typedef union {
    float		f[4];
} floatToVector;

typedef union {
    unsigned int	i[4];
} intToVector;

typedef struct SmokeParticleV
{
    floatToVector color[4];
    floatToVector pos[3];
    floatToVector oldPos[3];
    floatToVector deltaPos[3];
    intToVector dead;
    floatToVector time;
    intToVector animFrame;
} SmokeParticleV;


@interface FlurrySmoke : NSObject
{
@public
    SmokeParticleV particles[NUMSMOKEPARTICLES/4];
    CGFloat oldPos[3];
    GLfloat seraphimVertices[NUMSMOKEPARTICLES * 4 * 2];
    GLfloat seraphimColors[NUMSMOKEPARTICLES * 4 * 4];
    ushort seraphimIndices[NUMSMOKEPARTICLES * 6];
    GLfloat seraphimTextures[NUMSMOKEPARTICLES * 2 * 4];
}

- (instancetype)initWithBuffers:(Buffers *)buffers;

- (void)updateSmoke;
- (void)drawSmoke;

@property (nonatomic, assign) NSInteger frame;
@property (nonatomic, assign) BOOL firstTime;
@property (nonatomic, assign) CGFloat lastParticleTime;
@property (nonatomic, assign) NSInteger nextParticle;
@property (nonatomic, assign) NSInteger nextSubParticle;

@end
