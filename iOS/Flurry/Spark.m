//
//  Spark.m
//  Flurry
//
//  Created by Satish on 5/6/15.
//  Copyright (c) 2015 Satish Maha Software. All rights reserved.
//

#import "Spark.h"

#import "Constants.h"
#import "Math.h"
#import "State.h"

#define BIGMYSTERY 1800.0
#define MAXANGLES 16384

@interface Spark ()

@end

@implementation Spark

- (instancetype)initWithSparkAmount:(NSInteger)sparkAmount
{
    self = [super init];
    if (self)
    {
        self->mystery = ( BIGMYSTERY * (sparkAmount + 1) ) / 32.0f;

        for (NSInteger i=0;i<3;i++)
        {
            self->pos[i] = [self randomFloatBetween:-100.0 and:100.0];
        }
    }
    
    return self;
}

- (float)randomFloatBetween:(float)smallNumber and:(float)bigNumber
{
    float diff = bigNumber - smallNumber;
    return (((float) (arc4random() % ((unsigned)RAND_MAX + 1)) / RAND_MAX) * diff) + smallNumber;
}

- (void)updateColor
{
    State *state = [State sharedState];
    
    float rotationsPerSecond = (float) (2.0*M_PI*fieldSpeed/MAXANGLES);
    double thisAngle = state.time*rotationsPerSecond;
    float cycleTime = 20.0f;
    
    double thisPointInRadians;
    float colorRot;
    float redPhaseShift;
    float greenPhaseShift;
    float bluePhaseShift;
    float baseRed;
    float baseGreen;
    float baseBlue;
    float colorTime;
    
    if (state.currentColorMode == rainbowColorMode)
    {
        cycleTime = 1.5f;
    }
    else if (state.currentColorMode == tiedyeColorMode)
    {
        cycleTime = 4.5f;
    }
    else if (state.currentColorMode == cyclicColorMode)
    {
        cycleTime = 20.0f;
    }
    else if (state.currentColorMode == slowCyclicColorMode)
    {
        cycleTime = 120.0f;
    }
    
    colorRot = (float) (2.0*M_PI/cycleTime);
    redPhaseShift = 0.0f; //cycleTime * 0.0f / 3.0f
    greenPhaseShift = cycleTime / 3.0f;
    bluePhaseShift = cycleTime * 2.0f / 3.0f ;
    colorTime = state.time;
    if (state.currentColorMode == whiteColorMode)
    {
        baseRed = 0.1875f;
        baseGreen = 0.1875f;
        baseBlue = 0.1875f;
    }
    else if (state.currentColorMode == multiColorMode)
    {
        baseRed = 0.0625f;
        baseGreen = 0.0625f;
        baseBlue = 0.0625f;
    }
    else if (state.currentColorMode == darkColorMode)
    {
        baseRed = 0.0f;
        baseGreen = 0.0f;
        baseBlue = 0.0f;
    }
    else if (state.currentColorMode == magentaColorMode)
    {
        baseRed = 1.0f;
        baseGreen = 0.0f;
        baseBlue = 1.0f;
    }
    else
    {
        if (state.currentColorMode < slowCyclicColorMode)
        {
            colorTime = (state.currentColorMode / 6.0f) * cycleTime;
        }
        else
        {
            colorTime = state.time + state.randSeed;
        }
        baseRed = 0.109375f * ((float) cos((colorTime+redPhaseShift)*colorRot)+1.0f);
        baseGreen = 0.109375f * ((float) cos((colorTime+greenPhaseShift)*colorRot)+1.0f);
        baseBlue = 0.109375f * ((float) cos((colorTime+bluePhaseShift)*colorRot)+1.0f);
    }
    
    thisPointInRadians = 2.0 * M_PI * (double) self->mystery / (double) BIGMYSTERY;
    
    self->color[0] = baseRed + 0.0625f * (0.5f + (float) cos((15.0 * (thisPointInRadians + 3.0*thisAngle))) + (float) sin((7.0 * (thisPointInRadians + thisAngle))));
    self->color[1] = baseGreen + 0.0625f * (0.5f + (float) sin(((thisPointInRadians) + thisAngle)));
    self->color[2] = baseBlue + 0.0625f * (0.5f + (float) cos((37.0 * (thisPointInRadians + thisAngle))));
}

- (void)updateSpark
{
    State *state = [State sharedState];
    
    const float rotationsPerSecond = (float) (2.0*M_PI*fieldSpeed/MAXANGLES);
    
    [self updateColor];
    
    double thisAngle = state.time*rotationsPerSecond;
    
    for (int i=0; i<3; i++)
    {
        self->oldPos[i] = self->pos[i];
    }
    
    double thisPointInRadians = 2.0 * M_PI * (double) self->mystery / (double) BIGMYSTERY;
    float cf = ((float) (cos(7.0*((state.time)*rotationsPerSecond))+cos(3.0*((state.time)*rotationsPerSecond))+cos(13.0*((state.time)*rotationsPerSecond))));
    cf /= 6.0f;
    cf += 2.0f;
    
    self->pos[0] = fieldRange * 10 * cf * cos(11.0 * (thisPointInRadians + (3.0 * thisAngle)));
    self->pos[1] = fieldRange * 10 * cf * sin(12.0 * (thisPointInRadians + (4.0 * thisAngle)));
    self->pos[2] = fieldRange * 10 * cos((23.0 * (thisPointInRadians + (12.0 * thisAngle))));
    
    double rotation = thisAngle*0.501 + 5.01 * (double) self->mystery / (double) BIGMYSTERY;
    double cr = cos(rotation);
    double sr = sin(rotation);
    double tmpX1 = self->pos[0] * cr - self->pos[1] * sr;
    double tmpY1 = self->pos[1] * cr + self->pos[0] * sr;
    double tmpZ1 = self->pos[2];
    
    double tmpX2 = tmpX1 * cr - tmpZ1 * sr;
    double tmpY2 = tmpY1;
    double tmpZ2 = tmpZ1 * cr + tmpX1 * sr;
    
    double tmpX3 = tmpX2;
    double tmpY3 = tmpY2 * cr - tmpZ2 * sr;
    double tmpZ3 = tmpZ2 * cr + tmpY2 * sr + seraphDistance;
    
    rotation = thisAngle*2.501 + 85.01 * (double) self->mystery / (double) BIGMYSTERY;
    cr = cos(rotation);
    sr = sin(rotation);
    double tmpX4 = tmpX3 * cr - tmpY3 * sr;
    double tmpY4 = tmpY3 * cr + tmpX3 * sr;
    double tmpZ4 = tmpZ3;
    
    self->pos[0] = tmpX4 + [self randBell:5.0f * fieldCoherence];
    self->pos[1] = tmpY4 + [self randBell:5.0f * fieldCoherence];
    self->pos[2] = tmpZ4 + [self randBell:5.0f * fieldCoherence];
    
    for (int i=0; i<3; i++)
    {
        self->deltaPos[i] = (self->pos[i] - self->oldPos[i]) / state.deltaTime;
    }
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

@end
