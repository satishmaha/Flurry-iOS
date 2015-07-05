//
//  Star.h
//  Flurry
//
//  Created by Satish on 5/6/15.
//  Copyright (c) 2015 Satish Maha Software. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Star : NSObject

{
    @public
    float position[3];
    float mystery;
    float rotSpeed;
}

- (void)updateStar;

@end
