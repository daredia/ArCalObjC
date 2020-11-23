//
//  ViewController.m
//  ArCal
//
//  Created by Shehzad Daredia on 11/23/20.
//

#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController

NSString *cellId = @"cellId";

- (void)viewDidLoad {
    [super viewDidLoad];

//    self.view.backgroundColor = [UIColor yellowColor];
    self.navigationItem.title = @"Events";
    self.navigationController.navigationBar.prefersLargeTitles = YES;

    [self.tableView registerClass:UITableViewCell.class forCellReuseIdentifier:cellId];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return 5;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellId forIndexPath:indexPath];
    cell.backgroundColor = UIColor.lightGrayColor;
    cell.textLabel.text = @"Event title";
    return cell;
}


@end
