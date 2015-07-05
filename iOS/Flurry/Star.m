//
//  Star.m
//  Flurry
//
//  Created by Satish on 5/6/15.
//  Copyright (c) 2015 Satish Maha Software. All rights reserved.
//

#import "Star.h"

#import "Constants.h"
#import "Math.h"
#import "State.h"

#define BIGMYSTERY 180.0
#define MAXANGLES 16384

@implementation Star

- (instancetype)init
{
    self = [super init];
    if (self)
    {
        for (NSInteger i = 0; i < 3; i++)
        {
            self->position[i] = [self randomFloatBetween:-10000.0f and:10000.0f];
        }
        
        self->rotSpeed = [self randomFloatBetween:1.4f and:1.9f];
        self->mystery = [self randomFloatBetween:0.0f and:10.0f];
    }
    
    return self;
}

- (float)randomFloatBetween:(float)smallNumber and:(float)bigNumber
{
    float diff = bigNumber - smallNumber;
    return (((float) (arc4random() % ((unsigned)RAND_MAX + 1)) / RAND_MAX) * diff) + smallNumber;
}

- (void)updateStar
{
    State *state = [State sharedState];
    
    float rotationsPerSecond = (float) (2.0*M_PI*12.0/MAXANGLES) * self->rotSpeed;
    double thisAngle = state.time*rotationsPerSecond;
    
    float cf = cos(7 * thisAngle) + cos(3 * thisAngle) + cos(13 * thisAngle);
    cf /= 6.0f;
    cf += 0.75f;
    
    double thisPointInRadians = 2.0 * M_PI * (double) self->mystery / (double) BIGMYSTERY;
    
    self->position[0] = 250.0f * cf * (float) cos(11.0 * (thisPointInRadians + (3.0 * thisAngle)));
    self->position[1] = 250.0f * cf * (float) sin(12.0 * (thisPointInRadians + (4.0 * thisAngle)));
    self->position[2] = 250.0f * (float) cos((23.0 * (thisPointInRadians + (4 * thisAngle))));
    
    double tmpX1,tmpY1,tmpZ1;
    double tmpX2,tmpY2,tmpZ2;
    double tmpY3,tmpZ3;
    double rotation;
    double cr;
    double sr;
    
    rotation = thisAngle*0.501 + 5.01 * (double) self->mystery / (double) BIGMYSTERY;
    cr = cos(rotation);
    sr = sin(rotation);
    tmpX1 = self->position[0] * cr - self->position[1] * sr;
    tmpY1 = self->position[1] * cr + self->position[0] * sr;
    tmpZ1 = self->position[2];
    
    tmpX2 = tmpX1 * cr - tmpZ1 * sr;
    //    tmpY2 = tmpY1;
    tmpZ2 = tmpZ1 * cr + tmpX1 * sr;
    //    tmpX3 = tmpX2;
    tmpY3 = tmpY2 * cr - tmpZ2 * sr;
    tmpZ3 = tmpZ2 * cr + tmpY2 * sr + seraphDistance * 10;
    
    rotation = thisAngle*2.501 + 85.01 * (double) self->mystery / (double) BIGMYSTERY;
    cr = cos(rotation);
    sr = sin(rotation);
    
    self->position[0] = tmpX2 * cr - tmpY3 * sr;
    self->position[1] = tmpY3 * cr + tmpX2 * sr;
    self->position[2] = tmpZ3;
}

@end
