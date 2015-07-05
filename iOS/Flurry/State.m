//
//  State.m
//  Flurry
//
//  Created by Satish on 5/7/15.
//  Copyright (c) 2015 Satish Maha Software. All rights reserved.
//

#import "State.h"

@implementation State

+ (State *)sharedState
{
    static State *sharedState = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedState = [[State alloc] init];
    });
    return sharedState;
}

- (void)setTime:(CGFloat)time
{
    _time = time;
}

@end
